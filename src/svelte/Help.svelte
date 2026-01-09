<h2>Introduction</h2>

<p>
    For each level your task is to help the Caroline to achieve her goal. You do
    this by writing down simple instructions (<em>commands</em>) for her to
    follow.
</p>

<p>
    Each command must be written on its own line and Caroline will read and
    follow the commands one after another from top to bottom.
</p>
<p>
    For each level you can click on the <em>Goal</em> button to playback the movements
    that Caroline whats to perform.
</p>
<p>
    After writing down the commands you can click on the <em>Run</em> button to let
    her follow your instructions.
</p>
<p>Below you find a list of all available commands grouped by their effect.</p>

<div class="command-table">
    <h3>Halt command</h3>
    <p>
        Caroline must know when she can stop reading any more commands. Every
        program you write must end with the <code>halt</code> command.
    </p>
    <dl>
        <dt>
            <code class="cmd-help">halt</code>
        </dt>
        <dd>Stops the program.</dd>
    </dl>
    <h3>Movement commands</h3>
    <p>
        The movement commands tell Caroline to move around in the world. She can
        only take a single step at a time and only turn in 90° steps.
    </p>
    <dl>
        <dt>
            <code class="cmd-help">forward</code>
        </dt>
        <dd>Moves carol one step into the direction she is facing.</dd>
        <dt>
            <code class="cmd-help">turnLeft</code>
        </dt>
        <dd>Turns carol 90° clockwise</dd>

        <dt>
            <code class="cmd-help">turnRight</code>
        </dt>
        <dd>Turns carol 90° counter-clockwise</dd>

        <dt>
            <code class="cmd-help">turnAround</code>
        </dt>
        <dd>Turns carol 180°</dd>
    </dl>
    <h3>Comments</h3>
    <p>
        The comment commands are not for Caroline but for <em>you</em>.
        Everything following an <code>#</code> to the end of the line is ignored by
        Caroline.
    </p>
    <p>
        This allow you to write down your own notes and ideas in between the
        commands.
    </p>
    <dl>
        <dt>
            <code class="cmd-help"># some comment</code>
        </dt>
        <dd>
            Everything after a <code>#</code> to the end of the line is ignored
        </dd>
    </dl>
    <h3>Beeper commands</h3>
    <p>
        Caroline likes to collect the crystals that can be found in the world.
        Most of her tasks consist of collecting crystals or putting crystals at
        a specific place.
    </p>
    <p>
        Caroline can only pick up a crystal if she stands at the exectly same
        location. She can only put down (<em>drop</em>) a crystal if there is no
        other crystal at the same location yet.
    </p>
    <dl>
        <dt><code class="cmd-help">pick</code></dt>
        <dd>Picks the beeper at the current position</dd>
        <dt><code class="cmd-help">drop</code></dt>
        <dd>Places a beeper at the current position</dd>
    </dl>
    <h3>labels</h3>
    <p>
        All the lines in the program are numbered. This is for Caroline to not
        get lost while reading the commands. Additionally you can write labels
        on especially important lines you want to reference later, for example
        to tell Caroline to read them again.
    </p>
    <dl>
        <dt>
            <code class="cmd-help">&lt;label&gt;:</code>
        </dt>
        <dd>
            <p>
                A line can start with a label to later refer to it. Labels must
                be unique.
            </p>
            <p>
                A label must consist only of lower case letters and end with a
                double colon.
            </p>
        </dd>
    </dl>
    <h3>Jumps</h3>
    <p>
        The jump commands allow you to tell Caroline which command to read next.
        By default she reads one line after another, but you can also tell her
        to skip 5 lines down (ignoring everything in between) or to skip back up
        3 lines and repeat the commands she already read just before.
    </p>
    <dl>
        <dt>
            <code>jumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd>
            <p>
                Jumps up or down in the list of the commands for reading the
                next command. Does not move the robot but instead decides where
                to continue to read the next command.
            </p>
            <p>
                If n is a positive number the jump is downward. If n is a
                negative number (eg. <em>-4</em>) the jump is upward.
            </p>
        </dd>
        <dt>
            <code>jumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd>
            Jumps to a specific line for reading the next command. Does not move
            the robot. The <code>&lt;label&gt;</code> must be the label that has been
            given to another line.
        </dd>
    </dl>
    <h3>Check commands</h3>
    <p>
        Often you can not tell Caroline what to do in advance but you need her
        to take a look around her in the world to check if she stands right in
        front of a wall or if there is a crystal she can pick up.
    </p>
    <p>
        The <em>check</em> commands tell Caroline to take a look into her world.
        You can then use her insight to decide what to to next by using a
        <em>conditional jump command</em> (next section).
    </p>
    <div class="hightlight">
        <p>
            <strong>Important:</strong> Every <em>check</em> command
            <em>must</em> immediatly be followed by an conditional jump immediatly
            be followed by an conditional jump. Caroline will be confused if you ask
            her to check something but then do not tell her what to do next.
        </p>
    </div>
    <dl>
        <dt>
            <code class="cmd-help">checkBeeper</code>
        </dt>
        <dd>Checks if the robot is standing ontop of a Beeper</dd>
        <dt>
            <code class="cmd-help">checkBeeperAhead</code>
        </dt>
        <dd>Checks if a beeper is directly in front of the robot.</dd>

        <dt>
            <code class="cmd-help">checkWallAhead</code>
        </dt>
        <dd>Checks if a wall is directly in front of the robot.</dd>
        <dt>
            <code class="cmd-help">checkWallLeft</code>
        </dt>
        <dd>Check if a wall is directly to the left of the robot.</dd>
        <dt>
            <code class="cmd-help">checkWallRight</code>
        </dt>
        <dd>Check if a wall is directly to the right of the robot.</dd>
    </dl>

    <h3>Conditional Jumps</h3>
    <p>
        Conditional jump commands are similar to the regular jump command but
        their effect depends on the result of the previous <em>check</em> command
        the Caroline executed.
    </p>
    <dl>
        <dt>
            <code>ifYesJumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd>
            Similar to <code>jumpBy</code> but only if the answer to the
            previous <em>check</em> command was <strong>positive</strong>.
            Otherwise this command is ignored.
        </dd>
        <dt>
            <code>ifNotJumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd>
            Similar to <code>jumpBy</code> but only if the answer to the
            previous <em>check</em> command was <strong>negative</strong>.
            Otherwise this command is ignored.
        </dd>
        <dt>
            <code>ifYesJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd>
            Similar to <code>jumpTo</code> but only if the answer to the
            previous <em>check</em> command was <strong>positive</strong>.
            Otherwise this command is ignored.
        </dd>
        <dt>
            <code>ifNotJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd>
            Similar to <code>jumpTo</code> but only if the answer to the
            previous <em>check</em> command was <strong>negative</strong>.
            Otherwise this command is ignored.
        </dd>
    </dl>
    <h3>Bookmark Stack</h3>
    <p>
        Sometimes it can be useful for caroline to rember the number of the line
        she is currently reading, for her to come back to this exact line again
        later. You can tell her to use a bookmark to write down the current line
        number.
    </p>
    <p>
        Caroline can only return to bookmarked lines in the opposite order in
        which they wrote them down. If you tell her to return to a bookmarked
        line she will take the most recent bookmark.
    </p>
    <dl>
        <dt>
            <code class="cmd-help">bookmark</code>
        </dt>
        <dd>Saves the current line number on top of the stack of bookmarks.</dd>
        <dt>
            <code class="cmd-help">return</code>
        </dt>
        <dd>
            Takes the topmost bookmark from the stack and jump to the line below
            its line number.
        </dd>
        <dt>
            <code>bookmarkAndJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd>
            Save the current line number as bookmark onto the stack and
            immdiately jump the another line indicated by the label line
            indicated by the label.
        </dd>
    </dl>
</div>

<style>
    code {
        display: inline-block;
        padding: 2px 4px;
        background-color: #333;
        color: #fff;
        border-radius: 3px;
    }
    dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1em;
        justify-content: start;
        align-items: baseline;
    }
    dt {
        white-space: nowrap;
    }
    dt,
    dd {
        margin: 0;
        padding: 0;
    }
    dt {
        text-align: right;
    }
    @supports (grid-template-columns: subgrid) {
        .command-table {
            display: grid;
            grid-template-columns: max-content 1fr;
        }
        h3 {
            grid-column: 1 / -1;
        }
        p {
            grid-column: 1 / -1;
        }
        dl {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;
        }
    }
    .hightlight {
        padding: 1em;
        grid-column: 1 / -1;
        background: #ffc;
    }
</style>
