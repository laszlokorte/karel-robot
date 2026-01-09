<div class="command-table">
    <h3>Movement commands</h3>
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
    <dl>
        <dt>
            <code class="cmd-help"># some comment</code>
        </dt>
        <dd>
            Everything after a <code>#</code> to the end of the line is ignored
        </dd>
    </dl>
    <h3>Beeper commands</h3>
    <dl>
        <dt><code class="cmd-help">pick</code></dt>
        <dd>Picks the beeper at the current position</dd>
        <dt><code class="cmd-help">drop</code></dt>
        <dd>Places a beeper at the current position</dd>
    </dl>
    <h3>labels</h3>
    <dl>
        <dt>
            <code class="cmd-help">&lt;label&gt;:</code>
        </dt>
        <dd>
            A line can start with a label to later refer to it. Labels must be
            unique.
        </dd>
    </dl>
    <h3>Jumps</h3>
    <dl>
        <dt>
            <code>jumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd>
            Jumps up or down in the list of the commands for reading the next
            command. Does not move the robot but instead decides where to
            continue to read the next command.
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
    <dl>
        <dt>
            <code>ifYesJumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd></dd>
        <dt>
            <code>ifNotJumpBy</code>
            <code>&lt;n&gt;</code>
        </dt>
        <dd></dd>
        <dt>
            <code>ifYesJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd></dd>
        <dt>
            <code>ifNotJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd></dd>
    </dl>
    <h3>Bookmark Stack</h3>
    <dl>
        <dt>
            <code class="cmd-help">bookmark</code>
        </dt>
        <dd></dd>
        <dt>
            <code class="cmd-help">return</code>
        </dt>
        <dd></dd>
        <dt>
            <code>bookmarkAndJumpTo</code>
            <code>@&lt;label&gt;</code>
        </dt>
        <dd></dd>
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
            grid-template-columns: auto 1fr;
        }
        h3 {
            grid-column: 1 / -1;
        }
        dl {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;
        }
    }
</style>
