<script>
    import * as L from "partial.lenses";
    import * as R from "ramda";
    import {
        atom,
        view,
        update,
        combine,
        failableView,
        bindValue,
    } from "./svatom.svelte.js";
    import Split from "./Split.svelte";
    import * as predefined from "./levels.js";

    const {
        autoplaySpeed = atom(5),
        allLevels = atom(predefined.levels),
        allCommands = atom(predefined.solutions),
        world = atom({
            dirty: false,
            started: false,
            running: false,
            halted: false,
            error: null,
            level: {
                size: { x: 10, y: 10 },
                start: { x: 5, y: 5 },
                walls: Array(10 * 10).fill(false),
                crystals: Array(10 * 10).fill(false),
            },
            player: {
                pos: { x: 0, y: 0 },
                dir: { x: 0, y: 1 },
            },
            choice: null,
            program: {
                next: 0,
                commands: [],
            },
            stack: [],
        }),
    } = $props();
    const resolution = 32;

    const goal = atom(false);
    const levelKey = atom("lvl1");
    const currentCommands = $derived(
        view(
            [
                L.choose(({ levelKey }) => [
                    "allCommands",
                    L.valueOr([]),
                    L.find(R.whereEq({ level: levelKey })),
                    L.valueOr({
                        level: levelKey,
                    }),
                    "commands",
                    L.valueOr([]),
                    L.reread((cmds) => {
                        const labelMap = {};
                        let i = 0;
                        for (let c of cmds) {
                            if (c.label) {
                                if (labelMap[c.label] !== undefined) {
                                    labelMap[c.label] = -1;
                                } else {
                                    labelMap[c.label] = i;
                                }
                            }
                            i++;
                        }
                        return cmds
                            .map((c) => {
                                if (c.label && labelMap[c.label] === -1) {
                                    return { ...c, error: "duplicate label" };
                                }
                                if (c.arg) {
                                    if (c.arg[0] === "@") {
                                        const label = c.arg.slice(1).trim();
                                        if (!label) {
                                            return {
                                                ...c,
                                                error: "Label must not be empty",
                                            };
                                        }
                                        if (labelMap[label] >= 0) {
                                            return {
                                                ...c,
                                                numericArg: labelMap[label],
                                            };
                                        } else if (labelMap[label] === -1) {
                                            return {
                                                ...c,
                                                error: `Label is defined multiple times`,
                                            };
                                        }
                                        {
                                            return {
                                                ...c,
                                                error: `Unknown label @${label}`,
                                            };
                                        }
                                    } else {
                                        return {
                                            ...c,
                                            numericArg: parseInt(c.arg, 10),
                                        };
                                    }
                                }
                                return c;
                            })
                            .map((x, i) => {
                                const validOp =
                                    x.empty !== undefined ||
                                    validateOp(x.op, x.arg);
                                if (validOp.error) {
                                    return { ...x, error: validOp.error };
                                } else if (x.error) {
                                    return x;
                                } else if (
                                    !R.all(
                                        (jt) =>
                                            jt === false ||
                                            (jt >= 0 && jt < cmds.length),
                                        jumpTargets(x, i),
                                    )
                                ) {
                                    return {
                                        ...x,
                                        error: `Jump target (${jumpTargets(x, i).join(", ")}) outside range`,
                                    };
                                }
                                return x;
                            });
                    }),
                ]),
            ],
            combine({ allCommands, levelKey }),
        ),
    );
    const commandErrorCount = $derived(
        view(
            L.reread((commands) => {
                return R.count(
                    (cmd) => cmd.empty === undefined && cmd.error,
                    commands,
                );
            }),
            currentCommands,
        ),
    );
    function jumpTargets(c, ci) {
        switch (c.op) {
            case "ifYesJumpTo":
                return [c.numericArg];
            case "ifNotJumpTo":
                return [c.numericArg];
            case "jumpTo":
                return [c.numericArg];
            case "ifYesJumpBy":
                return [ci + c.numericArg];
            case "ifNotJumpBy":
                return [ci + c.numericArg];
            case "jumpBy":
                return [ci + c.numericArg];
            case "bookmarkAndJump":
                return [ci + 1, c.numericArg];
            case "bookmark":
                return [ci + 2];
        }
        return [];
    }
    const allJumpTargets = $derived(
        view(
            L.reread((commands) => {
                return commands.flatMap((c, ci) => {
                    return jumpTargets(c, ci);
                });
            }),
            currentCommands,
        ),
    );
    const currentLevel = $derived(
        view(
            L.choose(({ levelKey }) => [
                "allLevels",
                L.valueOr([]),
                L.whereEq({ id: levelKey }),
                "level",
                L.valueOr({
                    size: { x: 10, y: 10 },
                    start: { x: 5, y: 5 },
                    walls: Array(10 * 10).fill(false),
                    crystals: Array(10 * 10).fill(false),
                }),
            ]),
            combine({ allLevels, levelKey }),
        ),
    );

    const command = L.iso(
        (cmd) =>
            (cmd.indentSpaces || "") +
            (cmd.label ? `${cmd.label}:${cmd.labelSpace || ""}` : "") +
            (cmd.invalid
                ? `${cmd.invalid}${cmd.comment || ""}`
                : cmd.empty
                  ? `${cmd.empty}${cmd.comment || ""}`
                  : `${cmd.op || ""}${cmd.arg !== undefined ? ` ${cmd.arg}` : ""}${cmd.spaces || ""}${cmd.comment || ""}`),
        R.pipe(
            R.match(
                /(?<indentSpaces>\s*)(?:(?<label>[a-zA-Z]+):(?<labelSpace>\s*))?((?:(?<op>[a-zA-Z]+)(?: (?<arg>(?:@[a-zA-Z]*|[\+\-]?\d+)))?)(?<spaces>\s*)|(?<empty>\s*)|(?<invalid>[^#]+))(?<comment>#.*)?$/,
            ),
            R.prop("groups"),
        ),
    );
    const lines = $derived(
        view(
            [
                L.iso(
                    (array) => (array ? [...array, undefined] : [undefined]),
                    (array) =>
                        array.length == 0 ||
                        array[array.length - 1].empty == undefined ||
                        array[array.length - 1].empty != "" ||
                        array[array.length - 1].comment
                            ? array
                            : array.slice(0, -1),
                ),
                L.array([
                    L.defaults({
                        empty: "",
                    }),
                    command,
                ]),
            ],
            currentCommands,
        ),
    );
    const text = $derived(view(L.inverse(L.split("\n")), lines));
    const level = $derived(view("level", world));
    const player = $derived(view("player", world));
    const choice = $derived(view("choice", world));
    const halted = $derived(view("halted", world));
    const stack = $derived(view("stack", world));
    const program = $derived(view("program", world));
    const running = $derived(view("running", world));
    const started = $derived(view("started", world));
    const autoplay = $derived(view("autoplay", world));
    const autoplayDelay = $derived(
        view(
            [
                L.iso(
                    (x) => 1000 / x,
                    (x) => 1000 / x,
                ),
            ],
            autoplaySpeed,
        ),
    );

    $effect(() => {
        if (autoplay.value && running.value) {
            const frame = () => {
                executeLine();
                raf = window.setTimeout(frame, autoplayDelay.value);
            };
            let raf = window.setTimeout(frame, autoplayDelay.value);

            return () => window.clearTimeout(raf);
        }
    });

    const currentChoiceYesNo = $derived(
        view(
            [
                "choice",
                L.lens(
                    (r) => (r ? "yes" : "no"),
                    (r) => r === "yes",
                ),
            ],
            world,
        ),
    );
    const executionError = $derived(view("error", world));
    const executionErrorLine = $derived(view("command", executionError));
    const executionErrorMessage = $derived(view("message", executionError));
    const executionErrorPosition = $derived(view("location", executionError));
    const executionErrorKind = $derived(view("kind", executionError));

    function reloadLevel(init) {
        const lvl = currentLevel.value;
        const cmds = currentCommands.value;
        update((w) => {
            return {
                ...w,
                dirty: false,
                running: init,
                started: false,
                autoplay: false,
                error: null,
                program: {
                    next: init ? 0 : -1,
                    commands: cmds,
                },
                level: {
                    size: lvl.size,
                    crystals: lvl.crystals,
                    walls: lvl.walls,
                },
                player: {
                    pos: {
                        x: lvl.start.x,
                        y: lvl.start.y,
                    },
                    dir: { x: 1, y: 0 },
                },
                choice: null,
                halted: null,
                stack: [],
            };
        }, world);
    }

    reloadLevel(false);
    const lineCount = $derived(view("length", lines));
    const json = $derived(
        view(L.inverse(L.json({ space: "  " })), currentCommands),
    );
    const levelError = atom();
    const currentLevelText = $derived(
        failableView(
            [
                L.iso(
                    ({ size, walls, crystals, start }) =>
                        Array(size.y)
                            .fill(size.x)
                            .map((xs, y) =>
                                Array(xs)
                                    .fill(null)
                                    .map((_, x) => {
                                        if (start.x === x && start.y === y) {
                                            return "s";
                                        } else if (walls[y * xs + x]) {
                                            return "x";
                                        } else if (crystals[y * xs + x]) {
                                            return "*";
                                        } else {
                                            return ".";
                                        }
                                    })
                                    .join(""),
                            )
                            .join("\n"),

                    (text) => {
                        const lines = text.split("\n");
                        const maxWidth = lines.reduce(
                            (acc, l) => Math.max(acc, l.length),
                            0,
                        );
                        const minWidth = lines.reduce(
                            (acc, l) => Math.min(acc, l.length),
                            Infinity,
                        );
                        if (maxWidth !== minWidth) {
                            return new Error(
                                "invalid size " + maxWidth + ", " + minWidth,
                            );
                        }
                        const width = maxWidth;
                        const startIndex = text.indexOf("s");
                        if (startIndex < 0) {
                            return new Error("missing start position");
                        }
                        return {
                            size: { y: lines.length, x: width },
                            start: {
                                y: Math.floor(startIndex / (width + 1)),
                                x: startIndex % (width + 1),
                            },
                            walls: Array(lines.length * width)
                                .fill(false)
                                .map((def, i) => {
                                    const x = i % width;
                                    const y = Math.floor(i / width);

                                    return lines[y].slice(x, x + 1) === "x";
                                }),
                            crystals: Array(lines.length * width)
                                .fill(false)
                                .map((def, i) => {
                                    const x = i % width;
                                    const y = Math.floor(i / width);

                                    return lines[y].slice(x, x + 1) === "*";
                                }),
                        };
                    },
                ),
                L.setter((t, oldText) => {
                    const changedLine = Math.max(
                        0,
                        R.findIndex(
                            R.identity,
                            R.zipWith(
                                (a, b) => {
                                    return Math.abs(a.length - b.length) == 1;
                                },
                                t.split("\n"),
                                oldText.split("\n"),
                            ),
                        ),
                    );
                    const changedColumn = R.findIndex(
                        R.identity,
                        R.zipWith(
                            (a, b) => {
                                return a != b;
                            },
                            t.split("\n")[changedLine].split(""),
                            oldText.split("\n")[changedLine].split(""),
                        ),
                    );
                    const lines = t.split("\n");
                    const maxWidth =
                        changedColumn < 0
                            ? lines[changedLine].length
                            : oldText.split("\n")[0].length;
                    return lines
                        .map((l, _i, all) => {
                            return (
                                l + Array(maxWidth).fill(".").join("")
                            ).slice(0, maxWidth);
                        })
                        .join("\n");
                }),
            ],
            currentLevel,
            false,
            levelError,
        ),
    );
    function validateOp(op, arg) {
        if (
            ![
                "turnLeft",
                "turnRight",
                "turnAround",
                "forward",
                "pick",
                "drop",
                "checkWallAhead",
                "checkWallLeft",
                "checkWallRight",
                "checkBeeperAhead",
                "checkBeeper",
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "halt",
                "bookmark",
                "return",
                "bookmarkAndJump",
            ].includes(op)
        ) {
            return { error: "unknown command" };
        }
        if (
            [
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "bookmarkAndJump",
            ].includes(op) &&
            undefined === arg
        ) {
            return { error: "missing argument" };
        }
        if (
            ![
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "bookmarkAndJump",
            ].includes(op) &&
            undefined !== arg
        ) {
            return { error: "unexpected argument" };
        }

        const argIsLabel = arg && arg[0] === "@";
        const argIsNum = arg && arg[0] !== "@";
        if (
            [
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "bookmarkAndJump",
            ].includes(op) &&
            !argIsLabel
        ) {
            return { error: "Expect argument to be a @label" };
        }
        if (
            ["ifYesJumpBy", "ifNotJumpBy", "jumpBy"].includes(op) &&
            !argIsNum
        ) {
            return { error: "Expect argument to be a number" };
        }
        return true;
    }

    const viewBox = $derived(
        view(
            ({ size }) =>
                `-10 -10 ${size.x * resolution + 20} ${size.y * resolution + 20}`,
            level,
        ),
    );
    function runPlayerOp(op, player) {
        switch (op.op) {
            case "turnRight":
                return {
                    player: {
                        ...player,
                        dir: { x: -player.dir.y, y: player.dir.x },
                    },
                };
            case "turnLeft":
                return {
                    player: {
                        ...player,
                        dir: { x: player.dir.y, y: -player.dir.x },
                    },
                };
            case "turnAround":
                return {
                    player: {
                        ...player,
                        dir: { x: -player.dir.x, y: -player.dir.y },
                    },
                };
            case "forward":
                return {
                    player: {
                        ...player,
                        pos: {
                            x: player.pos.x + player.dir.x,
                            y: player.pos.y + player.dir.y,
                        },
                    },
                };
        }
        return { player: player };
    }
    function runLevelOp(op, cell) {
        switch (op.op) {
            case "pick":
                if (!cell) {
                    return { error: "There is no crystal to pick" };
                }
                return { newCell: false };
            case "drop":
                if (cell) {
                    return { error: "There is is already a crystal" };
                }
                return { newCell: true };
        }
        return { newCell: cell };
    }

    function runChoiceOp(op, player, level) {
        switch (op.op) {
            case "checkWallAhead": {
                const frontPos = {
                    x: player.pos.x + player.dir.x,
                    y: player.pos.y + player.dir.y,
                };
                return (
                    frontPos.y == -1 ||
                    frontPos.y == level.size.y ||
                    frontPos.x == -1 ||
                    frontPos.x == level.size.x ||
                    level.walls[frontPos.x + frontPos.y * level.size.x] === true
                );
            }
            case "checkWallRight": {
                const sidePos = {
                    x: player.pos.x - player.dir.y,
                    y: player.pos.y + player.dir.x,
                };
                return (
                    sidePos.y == -1 ||
                    sidePos.y == level.size.y ||
                    sidePos.x == -1 ||
                    sidePos.x == level.size.x ||
                    level.walls[sidePos.x + sidePos.y * level.size.x] === true
                );
            }
            case "checkWallLeft": {
                const sidePos = {
                    x: player.pos.x - player.dir.y,
                    y: player.pos.y + player.dir.x,
                };
                return (
                    sidePos.y == -1 ||
                    sidePos.y == level.size.y ||
                    sidePos.x == -1 ||
                    sidePos.x == level.size.x ||
                    level.walls[sidePos.x + sidePos.y * level.size.x] === true
                );
            }
            case "checkBeeperAhead": {
                const frontPos = {
                    x: player.pos.x + player.dir.x,
                    y: player.pos.y + player.dir.y,
                };
                if (
                    frontPos.y == -1 ||
                    frontPos.y == level.size.y ||
                    frontPos.x == -1 ||
                    frontPos.x == level.size.x
                ) {
                    return false;
                }
                return (
                    level.crystals[frontPos.x + frontPos.y * level.size.x] ===
                    true
                );
            }
            case "checkBeeper":
                return (
                    level.crystals[
                        player.pos.x + player.pos.y * level.size.x
                    ] === true
                );
        }
        return null;
    }
    function runConrolOp(op, line, choice, stack) {
        switch (op.op) {
            case "bookmark":
                if (stack.length > 12) {
                    return {
                        error: "To many bookmarks (Stack overflow)",
                        kind: "stack ",
                    };
                }
                return { line: line + 1, stack: [line + 2, ...stack] };
            case "bookmarkAndJump":
                if (stack.length > 12) {
                    return {
                        error: "To many bookmarks (Stack overflow)",
                        kind: "stack",
                    };
                }
                return { line: op.numericArg, stack: [line + 1, ...stack] };
            case "return":
                if (!stack.length) {
                    return { error: "No bookmark to return to", kind: "stack" };
                }
                return { line: stack[0], stack: stack.slice(1) };
            case "halt":
                return { line, halt: true, stack };
            case "ifYesJumpTo":
                if (choice === true) {
                    return {
                        line: op.numericArg,
                        stack,
                    };
                } else if (choice === false) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "ifNotJumpTo":
                if (choice === false) {
                    return {
                        line: op.numericArg,
                        stack,
                    };
                } else if (choice === true) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "jumpTo":
                return {
                    line: op.numericArg,
                    stack,
                };
            case "ifYesJumpBy":
                if (choice === true) {
                    return {
                        line: line + op.numericArg,
                        stack,
                    };
                } else if (choice === false) {
                    return { line: line + 1, stack };
                }
            case "ifNotJumpBy":
                if (choice === false) {
                    return {
                        line: line + op.numericArg,
                        stack,
                    };
                } else if (choice === true) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "jumpBy":
                return {
                    line: line + op.numericArg,
                    stack,
                };
        }
        if (choice !== null) {
            return { error: "must jump after check", kind: "choice" };
        }
        return {
            line: line + 1,
            stack,
        };
    }
    function runOp(op, level, player, line, choice, stack) {
        if (op.op === undefined) {
            return {
                player: player,
                choice: choice,
                level: level,
                stack,
                next: line + 1,
                empty: true,
            };
        }
        const validatedOp = validateOp(op.op, op.arg);
        if (validatedOp.error) {
            return { error: validatedOp.error, errorKind: "operation" };
        }
        const newPlayerResult = runPlayerOp(op, player);
        if (newPlayerResult.player) {
            const newPlayer = newPlayerResult.player;

            if (newPlayer.pos.x >= level.size.x || newPlayer.pos.x < 0) {
                return { error: "Player hit a wall", errorKind: "world" };
            }
            if (newPlayer.pos.y >= level.size.y || newPlayer.pos.y < 0) {
                return { error: "Player hit a wall", errorKind: "world" };
            }
            if (level.walls[newPlayer.pos.x + newPlayer.pos.y * level.size.x]) {
                return { error: "Player hit a wall", errorKind: "world" };
            }

            const newLevel = {
                ...level,
                crystals: level.crystals.reduce((acc, c, i) => {
                    if (acc.error) {
                        return acc;
                    }
                    if (
                        i ===
                        newPlayer.pos.x + newPlayer.pos.y * level.size.x
                    ) {
                        const result = runLevelOp(op, c);
                        if (result.error) {
                            return result;
                        }

                        return [result.newCell, ...acc];
                    } else {
                        return [c, ...acc];
                    }
                }, []),
                next: line,
            };
            if (newLevel.crystals.error) {
                return { error: newLevel.crystals.error, errorKind: "world" };
            }

            const nextControl = runConrolOp(op, line, choice, stack);

            if (nextControl.error) {
                return {
                    error: nextControl.error,
                    errorKind: nextControl.kind,
                };
            }
            return {
                player: newPlayer,
                choice: runChoiceOp(op, player, level),
                level: {
                    ...level,
                    crystals: newLevel.crystals.reverse(),
                },
                next: nextControl.line,
                stack: nextControl.stack,
                halt: !!nextControl.halt,
            };
        } else {
            return { error: newPlayerResult.error };
        }
    }
    function startExecution() {
        autoplay.value = true;
    }
    function pauseExecution() {
        autoplay.value = false;
    }

    function beginEdit() {
        reloadLevel(false);
    }
    function beginExecute() {
        reloadLevel(true);
    }
    function resetExecution() {
        reloadLevel(true);
    }
    function executeLine() {
        update(
            ({
                program: { next },
                player,
                commands,
                level,
                choice,
                error,
                halted,
                running,
                stack,
                autoplay,
            }) => {
                if (halted) {
                    return {
                        program: { next },
                        player: player,
                        level: level,
                        choice: choice,
                        error: error,
                        running: running,
                        halted: halted,
                        started: started,
                        autoplay: false,
                    };
                }
                if (next == commands.length) {
                    return {
                        error: {
                            message: `End of program reached`,
                            command: next,
                        },
                        program: { next },
                        player: player,
                        level: level,
                        stack: stack,
                        running: false,
                        started: true,
                        autoplay: false,
                    };
                }
                if (next < commands.length) {
                    const result = runOp(
                        commands[next],
                        level,
                        player,
                        next,
                        choice,
                        stack,
                    );
                    if (result.error) {
                        return {
                            error: {
                                message: result.error,
                                command: next,
                                location: player,
                                kind: result.errorKind,
                            },
                            program: { next },
                            player: player,
                            level: level,
                            stack: stack,
                            running: running,
                            started: true,
                            autoplay: false,
                        };
                    } else {
                        if (result.next < 0 || result.next > commands.length) {
                            return {
                                error: {
                                    message: `Can not jump to line ${result.next}`,
                                    command: next,
                                },
                                program: { next },
                                player: player,
                                level: level,
                                stack: stack,
                                running: false,
                                started: true,
                                autoplay: false,
                            };
                        }
                        return {
                            program: { next: result.next },
                            player: result.player,
                            level: result.level,
                            choice: result.choice,
                            error: null,
                            stack: result.stack,
                            running: true,
                            halted: result.halt,
                            started: true,
                            autoplay: autoplay && !result.halt,
                        };
                    }
                } else {
                    return {
                        program: { next: commands.length },
                        player,
                        level,
                        choice,
                        stack,
                        error: null,
                        running: false,
                        started: true,
                        autoplay: false,
                    };
                }
            },
            combine(
                {
                    program,
                    player,
                    choice,
                    commands: currentCommands,
                    level,
                    error: executionError,
                    running,
                    started,
                    halted,
                    stack,
                    autoplay,
                },
                {
                    program: true,
                    player: true,
                    choice: true,
                    commands: false,
                    level: true,
                    error: true,
                    running: true,
                    started: true,
                    halted: true,
                    stack: true,
                    autoplay: false,
                },
            ),
        );
    }
</script>

<div class="container">
    <div class="controls">
        <h1>Caroline The Robot (<abbr title="Work in Progress">WIP</abbr>)</h1>
        <div class="button-row">
            <label>
                Level: <select
                    bind:value={levelKey.value}
                    onchange={(evt) => reloadLevel(false)}
                >
                    {#each allLevels.value as l, li (l.id)}
                        <option value={l.id} selected={levelKey.value === l.id}
                            >{l.name}</option
                        >
                    {/each}
                </select>
            </label>

            <button
                class="level-button"
                onclick={(evt) => {
                    reloadLevel(false);
                }}>Reload</button
            >
        </div>
    </div>
    <div
        style="display: none; grid-template-columns: 1fr 1fr; border: 2px solid gray; border-bottom: none; box-sizing: border-box;gap: 1ex; padding: 1ex;"
    >
        <div
            style="display: grid; grid-template-rows: 1fr auto; box-sizing: border-box; "
        >
            <textarea
                style="font-family: monospace; align-self: stretch; resize: none;  box-sizing: border-box; width: auto; overflow: auto;
            white-space: pre;
            "
                use:bindValue={currentLevelText}
            ></textarea>
            <div
                style="background-color: #fee; align-items: center;gap: 1em;overflow: auto;"
                style:display={levelError.value ? "flex" : "none"}
            >
                <button
                    onclick={() => {
                        update((t) => {
                            const lines = t.trim().split("\n");
                            const maxWidth = lines[0].length;
                            return lines
                                .map((l, _i, all) => {
                                    return (
                                        l + Array(maxWidth).fill(".").join("")
                                    ).slice(0, maxWidth);
                                })
                                .join("\n");
                        }, currentLevelText);
                    }}>auto fix</button
                >

                {levelError.value}
            </div>
        </div>
        <textarea
            style="overflow: auto; height: 10em; font-family: monospace;"
            readonly={true}>{json.value}</textarea
        >
    </div>

    <div class="robot-container">
        <Split
            content={atom([
                { size: 30, content: "x" },
                { size: 30, content: "y" },
            ])}
        >
            {#snippet children(i)}
                {#if i == 1}
                    <div class="editor">
                        <div class="toolbar">
                            <div class="toggle-buttons">
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        active: false,
                                    }}
                                    onclick={beginGoal}
                                    disabled={!running.value}
                                    >Goal
                                </button>
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        active: !running.value,
                                    }}
                                    onclick={beginEdit}
                                    disabled={!running.value}
                                    >Edit
                                </button>
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        error: commandErrorCount.value > 0,
                                        active: running.value,
                                    }}
                                    onclick={beginExecute}
                                    disabled={!currentCommands.value.length ||
                                        commandErrorCount.value > 0 ||
                                        running.value}>Run</button
                                >
                            </div>
                            {#if running.value}
                                <div class="button-row">
                                    <button
                                        class="flow-button"
                                        type="button"
                                        onclick={resetExecution}
                                        >Reset
                                    </button>
                                    <button
                                        class="flow-button"
                                        type="button"
                                        onclick={executeLine}
                                        disabled={executionError.value ||
                                            halted.value ||
                                            commandErrorCount.value > 0 ||
                                            autoplay.value}
                                        >Step
                                    </button>
                                    <button
                                        class="flow-button"
                                        type="button"
                                        disabled={!currentCommands.value
                                            .length ||
                                            executionError.value ||
                                            halted.value ||
                                            autoplay.value}
                                        onclick={startExecution}
                                        >Play
                                    </button>
                                    <button
                                        class="flow-button"
                                        type="button"
                                        disabled={!currentCommands.value
                                            .length ||
                                            executionError.value ||
                                            halted.value ||
                                            !autoplay.value}
                                        onclick={pauseExecution}
                                        >Pause
                                    </button>
                                </div>

                                <label class="slider">
                                    <div>
                                        Playback Speed:
                                        <output
                                            >{autoplaySpeed.value}&times;</output
                                        >
                                    </div>
                                    <input
                                        type="range"
                                        bind:value={autoplaySpeed.value}
                                        min="1"
                                        max="50"
                                        step="1"
                                    />
                                </label>
                            {:else if commandErrorCount.value > 0}
                                <div class="error-summary">
                                    {commandErrorCount.value}
                                    {commandErrorCount.value > 1
                                        ? "Errors"
                                        : "Error"}
                                </div>
                            {/if}
                        </div>
                        <label
                            class={{
                                "line-numbered": true,
                                disabled: running.value,
                            }}
                        >
                            <div class="line-numbers">
                                {#each { length: lines.value.length } as _, l (l)}
                                    {@const c = currentCommands.value[l] ?? {}}
                                    <span
                                        class={{
                                            "line-number": true,
                                            active: program.value.next == l,
                                            error:
                                                executionErrorLine.value == l ||
                                                !!c.error,
                                            halted: halted.value,
                                            targetted:
                                                allJumpTargets.value.includes(
                                                    l,
                                                ),
                                        }}
                                    >
                                        {l}
                                    </span>
                                {/each}
                            </div>
                            <div class="overlay">
                                <div
                                    class={{
                                        faded: running.value,
                                        "overlay-layer": true,
                                        "overlay-annotations": true,
                                    }}
                                >
                                    {#each currentCommands.value as l}
                                        <span
                                            class={{
                                                annotation: true,
                                                invalid:
                                                    l.empty !== "" &&
                                                    (!!l.invalid || !!l.error),
                                            }}
                                            >{l.indentSpaces ||
                                                ""}{#if l.label}<span
                                                    class={{ label: true }}
                                                    >{l.label}:</span
                                                >{l.labelSpace}
                                            {/if}{#if l.empty !== undefined}
                                                <span class="empty"
                                                    >{l.empty}</span
                                                ><span class="comment"
                                                    >{l.comment}</span
                                                ><span>{" "}</span>
                                            {:else if l.invalid}<span
                                                    class="invalid"
                                                    >{l.invalid || " "}</span
                                                ><span class="comment"
                                                    >{l.comment || ""}</span
                                                >
                                            {:else}
                                                <span
                                                    class={{
                                                        "annotation-body": true,
                                                        empty: !!l.empty,
                                                        valid: !l.error,
                                                        invalid: l.error,
                                                    }}>{l.op || " "}</span
                                                >{#if l.arg !== undefined}
                                                    <span class="spaces"
                                                        >{" "}</span
                                                    ><span
                                                        class={{
                                                            "annotation-body": true,
                                                            label: true,
                                                            empty: !!l.empty,
                                                            valid: !l.error,
                                                            invalid: l.error,
                                                        }}
                                                        >{l.arg}<span
                                                            class={{
                                                                "annotation-extra": true,
                                                                hidden:
                                                                    l.arg ==
                                                                    l.numericArg,
                                                            }}
                                                            >&nbsp;(#{l.numericArg})
                                                        </span>
                                                    </span>
                                                {/if}<span class="spaces"
                                                    >{l.spaces || ""}</span
                                                ><span class="comment"
                                                    >{l.comment || ""}</span
                                                ><span>{" "}</span>
                                            {/if}
                                        </span>
                                    {/each}
                                </div>
                                <div
                                    style="z-index: 100; pointer-events: none;"
                                    class={{
                                        "overlay-layer": true,
                                        "overlay-annotations": true,
                                        "annoatation-right": true,
                                    }}
                                >
                                    {#each currentCommands.value as l, li}
                                        <span
                                            style="background: none;"
                                            class={{
                                                annotation: true,
                                            }}
                                        >
                                            <span
                                                style="color: transparent; background: none"
                                            >
                                                {l.indentSpaces ||
                                                    ""}{#if l.label}<span
                                                        >{l.label}:</span
                                                    >{l.labelSpace}
                                                {/if}{#if l.empty !== undefined}<span
                                                        >{l.empty}</span
                                                    ><span>{l.comment}</span
                                                    >{:else if l.invalid}<span
                                                        >{l.invalid || ""}</span
                                                    ><span
                                                        >{l.comment || ""}</span
                                                    >{:else}<span class={{}}
                                                        >{l.op || " "}{l.arg !==
                                                        undefined
                                                            ? " " + l.arg
                                                            : ""}</span
                                                    ><span
                                                        >{l.spaces || ""}</span
                                                    ><span
                                                        >{l.comment || ""}</span
                                                    >
                                                {/if}</span
                                            >
                                            {#if l.invalid}<span>{" - "}</span
                                                ><span class="inlay error"
                                                    >Invalid syntax</span
                                                >{:else if !!l.error}<span
                                                    >{" - "}</span
                                                ><label class="inlay error"
                                                    ><input
                                                        type="checkbox"
                                                    />{l.error}</label
                                                >{/if}
                                            {#if executionErrorLine.value === li}
                                                <label class="inlay error">
                                                    <input
                                                        type="checkbox"
                                                    />{executionErrorMessage.value}</label
                                                >
                                            {/if}
                                        </span>
                                    {/each}
                                    <span
                                        style="background: none;"
                                        class={{
                                            annotation: true,
                                        }}
                                    >
                                        {#if executionErrorLine.value === currentCommands.value.length}
                                            <span class="inlay error"
                                                >{executionErrorMessage.value}</span
                                            >
                                        {/if}
                                    </span>
                                </div>
                                <textarea
                                    cols="0"
                                    rows="0"
                                    use:bindValue={text}
                                    autocomplete="off"
                                    autocorrect="off"
                                    autocapitalize="off"
                                    spellcheck="false"
                                    readonly={running.value}
                                    class={{
                                        hidden: running.value,
                                        "overlay-layer": true,
                                        "overlay-input": true,
                                    }}
                                ></textarea>
                            </div>
                        </label>
                    </div>
                {:else}
                    <div style="display: flex; flex-direction: column;">
                        <div class="world-stack">
                            <div
                                class={{
                                    "stack-container": true,
                                    error: executionErrorKind.value === "stack",
                                }}
                            >
                                <h3 class="stack-head">
                                    Bookmark<br /> Stack:
                                </h3>
                                <ol class="stack-body">
                                    {#each stack.value as s}
                                        <li class="stack-item">
                                            {s}
                                        </li>
                                    {:else}
                                        <li class="stack-empty">Empty</li>
                                    {/each}
                                </ol>
                            </div>
                            <div class="canvas-container">
                                <svg
                                    class="canvas"
                                    viewBox={viewBox.value}
                                    preserveAspectRatio="xMidYMin meet"
                                >
                                    {#each { length: level.value.size.y } as _, y}
                                        {#each { length: level.value.size.x } as _, x}
                                            <rect
                                                x={x * resolution}
                                                y={y * resolution}
                                                width={resolution}
                                                height={resolution}
                                                fill="#f0f0f0"
                                                stroke="#ccc"
                                                shape-rendering="geometricPrecision"
                                                vector-effect="non-scaling-stroke"
                                            ></rect>
                                        {/each}
                                    {/each}
                                    {#each { length: level.value.size.y } as _, y}
                                        {#each { length: level.value.size.x } as _, x}
                                            {@const isWall =
                                                level.value.walls[
                                                    y * level.value.size.x + x
                                                ]}
                                            {@const isCrystal =
                                                level.value.crystals[
                                                    y * level.value.size.x + x
                                                ]}
                                            {#if isCrystal}
                                                {@render diamond(
                                                    x,
                                                    y,
                                                    resolution,
                                                )}
                                            {/if}
                                            {#if isWall}
                                                {@render wall(x, y, resolution)}
                                            {/if}
                                        {/each}
                                    {/each}
                                    {@render robot(
                                        player.value.pos.x,
                                        player.value.pos.y,
                                        player.value.dir.x,
                                        player.value.dir.y,
                                        resolution,
                                        choice.value,
                                    )}
                                    {#if executionErrorPosition.value && executionErrorKind.value == "world"}
                                        {@render error(
                                            executionErrorPosition.value.pos.x,
                                            executionErrorPosition.value.pos.y,
                                            resolution,
                                        )}
                                    {/if}
                                    <rect
                                        x={-3}
                                        y={-3}
                                        width={resolution * level.value.size.x +
                                            6}
                                        height={resolution *
                                            level.value.size.y +
                                            6}
                                        fill="none"
                                        stroke-width="6"
                                        stroke="#555"
                                        shape-rendering="crispEdges"
                                    ></rect>
                                </svg>
                            </div>
                        </div>
                    </div>
                {/if}
            {/snippet}
        </Split>
        {#snippet robot(x, y, dx, dy, size, choice)}
            <g
                transform="rotate({(Math.atan2(dy, dx) * 180) / Math.PI +
                    90} {x * size + size / 2} {y * size + size / 2})"
            >
                <rect
                    x={x * size}
                    y={y * size + (size * (1 - 1 / 1.9)) / 2}
                    width={size}
                    height={size / 1.9}
                    fill="#3300ff"
                    stroke-width="1"
                    stroke="#110022"
                    rx="10"
                    ry="10"
                    vector-effect="non-scaling-stroke"
                ></rect>
                <circle
                    cx={x * size + size / 2}
                    cy={y * size + size / 2}
                    r={size / 1.6 / 2}
                    fill="#aaaadd"
                    stroke-width="2"
                    stroke="#1100aa"
                    rx="10"
                    ry="10"
                    vector-effect="non-scaling-stroke"
                ></circle>
                <polygon
                    stroke="#1100aa"
                    stroke-width="1"
                    points="{size * x + size / 2 - size / 6} {size * y +
                        size / 2 +
                        size / 20}
                {size * x + size / 2} {size * y +
                        size / 2 -
                        size / 6 +
                        size / 20}
                    {size * x + size / 2 + size / 6} {size * y +
                        size / 2 +
                        size / 20}
                        "
                    fill="#3300ff"
                    class={{
                        "choice-yes": choice === true,
                        "choice-no": choice === false,
                    }}
                    stroke-linejoin="round"
                    stroke-linecap="round"
                ></polygon>
                <circle
                    fill="white"
                    class={{
                        "choice-yes": choice === true,
                        "choice-no": choice === false,
                    }}
                    r="2.5"
                    stroke-width="1.5"
                    stroke="#1100aa"
                    cx={size * x + size / 2 - size / 7}
                    cy={size * y + size / 2 - size / 4}
                ></circle>
                <circle
                    fill="white"
                    class={{
                        "choice-yes": choice === true,
                        "choice-no": choice === false,
                    }}
                    r="2.5"
                    stroke-width="1.5"
                    stroke="#1100aa"
                    cx={size * x + size / 2 + size / 7}
                    cy={size * y + size / 2 - size / 4}
                ></circle>
            </g>
        {/snippet}

        {#snippet wall(x, y, size)}
            <rect
                x={x * size}
                y={y * size}
                width={size}
                height={size}
                fill="#555"
                stroke-width="0"
                shape-rendering="crispEdges"
            ></rect>
        {/snippet}
        {#snippet diamond(x, y, size)}
            <polygon
                fill="#48f273"
                points="{size * x + size / 2} {size * y + size / 2} {size *
                    x} {size * y + size / 2} {size * x + size / 2} {size * y} "
            ></polygon>
            <polygon
                fill="#28a233"
                points="{size * x + size / 2} {size * y + size / 2} {size * x +
                    size} {size * y + size / 2} {size * x + size / 2} {size *
                    y} "
            ></polygon>
            <polygon
                fill="#28b233"
                points="{size * x + size / 2} {size * y + size / 2} {size *
                    x} {size * y + size / 2} {size * x + size / 2} {size * y +
                    size} "
            ></polygon>
            <polygon
                fill="#285233"
                points="{size * x + size / 2} {size * y + size / 2} {size * x +
                    size} {size * y + size / 2} {size * x + size / 2} {size *
                    y +
                    size} "
            ></polygon>
            <polygon
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke="#285233"
                fill="none"
                points="{size * x + size / 2} {size * y}
            {size * x + size} {size * y + size / 2}
            {size * x + size / 2} {size * y + size}
            {size * x} {size * y + size / 2}

            "
            ></polygon>
        {/snippet}
        {#snippet error(x, y, size)}
            <polygon
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke="red"
                stroke-widht="3"
                fill-opacity="0.8"
                fill="#aa0000"
                points="{size * x + size / 2} {size * y}
            {size * x + size} {size * y + size / 2}
            {size * x + size / 2} {size * y + size}
            {size * x} {size * y + size / 2}

            "
            ></polygon>
        {/snippet}
    </div>
</div>

<style>
    .controls {
        display: flex;
        align-items: stretch;
        font-family: monospace;
        gap: 3em;
        padding: 1ex 1em;
        justify-content: space-between;
        background-image: linear-gradient(#fff, #eee, #ccc);
        border-bottom: 2px solid #bbb;
    }
    .controls label:has(select, input) {
        display: flex;
        align-items: center;
        gap: 1ex;
    }
    select {
        align-self: stretch;
        min-width: 20em;
        padding: 0 1ex;
    }
    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 1ex;
        padding: 0.5ex;
        background-color: #333;
        color: #eee;
        border-bottom: 2px solid #444;
        font-family: monospace;
        overflow: hidden;
        justify-content: space-between;
    }
    button {
        font: inherit;
        padding: 0.8ex;
        margin: 0;
        border: 1px solid #fff5;
    }
    abbr {
        cursor: help;
    }
    .slider {
        flex-grow: 1;
        flex-basis: 10em;
        padding: 0 1ex;
        margin-left: auto;
        justify-self: end;
        align-self: end;
    }

    .slider input {
        margin: 0;
        padding: 0;
        --accent-color: #399;
    }

    .button-row {
        display: flex;
        gap: 5px;
        padding: 2px;
    }
    .toggle-buttons {
        display: flex;
        gap: 0;
        border: 1px solid #fff5;
        border-radius: 7px;
    }
    .toggle-button {
        border: none;
        background-color: transparent;
        padding: 1.5ex 2ex;
        color: #fff;
        margin: 1px;
        border-radius: 5px;
    }
    .toggle-button.active {
        color: #fff;
        font-weight: normal;
        background-color: #084;
        border: 1px solid #0a6;
        color: #cfe;
        font-weight: bold;
        border-color: #fff5;
    }
    .toggle-button.error {
        color: #ff9999aa;
        text-decoration: line-through;
    }
    .flow-button {
        border-radius: 8px;
        border-width: 2px;
        border-color: #399;
        background-color: #166;
    }
    .flow-button:hover {
        border-color: #4aa;
        background-color: #277;
    }
    .flow-button:active {
        border-color: #388;
        background-color: #266;
    }
    .flow-button:disabled {
        color: #fffa;
        border-color: #333;
        background-color: #444;
    }
    .overlay {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        justify-content: stretch;
        align-content: stretch;

        padding: 1ex 0;
        background-color: #fff3;
        word-spacing: 3px;
        letter-spacing: 1px;
    }

    .overlay-layer {
        grid-area: 1 / 1 / -1 / -1;
        resize: none;
    }
    .overlay-layer.faded .annotation-body {
        background-color: #ff000055;
        border-color: transparent;
    }
    .overlay-layer.faded .annotation-body.valid {
        background-color: #0844;
        outline: 1px solid #0a68;
    }
    .overlay-layer.faded .valid.label {
        background-color: #aa00ff44;
        outline: 1px solid #cc00ff88;
    }
    .overlay-layer.faded .annotation {
        color: inherit;
    }
    .annotation-extra {
        display: none;
    }

    .overlay-layer.faded .annotation-extra {
        display: inline;
    }

    .overlay-annotations {
        z-index: 10;
        display: flex;
        flex-direction: column;
        white-space: pre;
    }
    .annotation {
        display: inline;
        position: relative;
        color: transparent;
        padding-left: 1ex;
        letter-spacing: inherit;
        word-spacing: inherit;
    }

    .annotation-body:not(.empty) {
        background-color: none;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
        border-radius: 3px;
        outline-offset: -1px;
        z-index: 10;
        position: relative;
    }
    .annotation-body.valid {
        background-color: #00ff0033;
        outline: 1px solid #00cc00;
    }

    .annotation-body.invalid {
        background-color: #ff000033;
        outline: 1px solid #cc0000;
    }

    .annotation-body.label {
        background-color: #aa00ff33;
        outline: 1px solid #cc00ff;
    }

    .label {
        background-color: #ff00aa33;
        outline: 1px solid #cc00cc;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
        border-radius: 3px;
        outline-offset: -1px;
        z-index: 10;
        position: relative;
    }

    .overlay-input {
        z-index: 20;
        font: inherit;
        padding: 0;
        padding-left: 1ex;
        border: none;
        margin: 0;
        outline: none;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        max-width: none;
        max-height: none;
        line-height: inherit;
        background-color: transparent;
        color: inherit;
        white-space: pre;
        letter-spacing: inherit;
        word-spacing: inherit;
    }

    .line-numbers {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: sticky;
        left: 0;
        background-color: inherit;
        z-index: 100;
        padding: 1ex;
        line-height: inherit;
    }

    .line-number {
        text-align: right;
        min-width: 2em;
        padding-right: 1ex;
        color: #aaa;
    }
    .line-number.active {
        background: aquamarine;
        color: #000;
    }

    .line-number.active.halted {
        background: goldenrod;
        color: #000;
    }

    .line-number.error {
        background: palevioletred;
        color: #000;
    }
    .line-number.active.error {
        outline: 2px solid aquamarine;
    }
    .line-number.targetted {
        text-decoration: underline;
    }

    .line-numbered {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1ex;
        font-family: monospace;
        font-size: 1.2em;
        background-color: #333;
        color: #fff;
        line-height: 1.75;
        border: 4px solid transparent;
        position: relative;
        overflow: auto;
    }
    .line-numbered:not(.disabled):has(:focus-visible) {
        border-color: #0c8;
    }
    .line-numbered.disabled:has(:focus-visible) {
        border-color: gray;
    }

    .robot-container {
        display: block;
        width: 100%;
        overflow: auto;
        box-sizing: border-box;
    }
    .world-stack {
        display: grid;
        grid-template-rows: auto minmax(10em, 1fr);
        flex-direction: column;
        align-content: stretch;
        align-items: stretch;
        justify-content: stretch;
        width: 100%;
        height: 100%;
    }
    .canvas-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        align-content: stretch;
        align-items: stretch;
        grid-template-rows: 1fr;
    }
    .canvas {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
    }
    .comment {
        background-color: gray;
        z-index: 10;
        position: relative;
    }
    .comment:not(:empty) {
        border-radius: 4px;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
    }
    .invalid {
        background-color: #500;
    }
    .line-number.error {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-decoration-color: transparent;
    }
    .inlay {
        z-index: 100;
        color: #ffeeee;
        background-color: #550000;
        outline: 1px solid #ffaaaa;
        border-radius: 3px;
        padding: 0.3ex 1ex;
        border: none;
        font-size: 0.8em;
        font-style: italic;
        vertical-align: middle;
        margin-left: auto;
        position: sticky;
        margin-right: -1ex;
        right: 2ex;
        box-sizing: border-box;
        pointer-events: all;
    }
    .inlay > input {
        display: none;
    }
    .inlay:has(> input) {
        cursor: pointer;
    }
    .inlay:has(> :checked) {
        display: inline-flex;
        vertical-align: text-top;
        margin: 0;
        height: 1.4em;
        overflow: hidden;
        width: 1.4em;
        padding: 0;
        border-radius: 100%;
        color: transparent;
        text-align: center;
        justify-content: start;
        align-items: center;
        text-align: center;
        flex-direction: column;
        line-height: 1.6em;
        outline: none;
    }
    .inlay::before {
        content: "❌";
        font-weight: bold;
        color: #faa;
        font-style: normal;
        letter-spacing: 1ex;
        vertical-align: baseline;
    }
    .inlay:has(> :checked)::before {
        font-size: 1.4em;
        letter-spacing: 0;
    }
    .annoatation-right {
        text-align: right;
    }

    .choice-no {
        fill: #ff6666;
        stroke: #cc0000;
    }
    .choice-yes {
        fill: #66ff66;
        stroke: #00cc00;
    }
    .stack-container {
        margin-bottom: auto;
        padding: 1ex;
        flex-basis: 2em;
        display: flex;
        align-items: stretch;
        gap: 1ex;
        justify-content: space-between;
    }
    .stack-container.error {
        color: #a00;

        & .stack-body {
            border-color: #a00;
        }
        & .stack-head {
            background-color: #a00;
            color: #fff;
        }
    }
    .stack-head {
        text-align: right;
        font-size: 1em;
        margin: 0;
        padding: 0 2ex 0 1ex;
        display: flex;
        align-items: center;
        font-family: monospace;
        background-color: #eee;
        border-radius: 8px;
    }
    .stack-body {
        flex-grow: 1;
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #ccc;
        gap: 0.5ex;
        padding: 0.5ex;
        border-left: 0;
        justify-content: end;
        border-radius: 5px;
    }
    .stack-item {
        padding: 1ex;
        border: 1px solid gray;
        box-sizing: border-box;
        flex-shrink: 1;
        font-family: monospace;
        border-radius: 4px;
    }
    .stack-empty {
        padding: 1ex;
        font-style: italic;
        border: 1px solid transparent;
        font-family: monospace;
    }

    .error-summary {
        align-self: stretch;
        display: flex;
        align-items: center;
        color: #ffbbbb;
        font-weight: bold;
    }
    .hidden {
        display: none !important;
    }
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-rows: auto 1fr;
    }
    .editor {
        display: grid;
        grid-template-rows: auto 1fr;
        background-color: #333;
        max-height: 100%;
        align-self: stretch;
        overflow-y: auto;
    }
    .level-button {
        border-radius: 8px;
        padding: 1ex 1em;
    }
    h1 {
        margin: 0;
        font-size: 1em;
        align-self: center;
        padding: 0;
    }
</style>
