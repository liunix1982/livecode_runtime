package com.liunix.complete1;

import java.io.IOException;

import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.util.JavacTask;

public class Cache {
    final String contents;
    final String file;
    final CompilationUnitTree root;
    final JavacTask task;
    final int line, character;

    Cache(String file, String contents, int line, int character) {
        // If `line` is -1, recompile the entire file
        if (line == -1) {
            this.contents = contents;
        }
        // Otherwise, focus on the block surrounding line:character,
        // erasing all other block bodies and everything after the cursor in its own
        // block
        else {
            Pruner p = new Pruner(file, contents);
            p.prune(line, character); 
            this.contents = p.contents();
        }
        this.file = file;
        this.task = new SingleFileTask().buildTask(file, this.contents);
        try {
            this.root = task.parse().iterator().next();
            // The results of task.analyze() are unreliable when errors are present
            // You can get at `Element` values using `Trees`
            task.analyze();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        this.line = line;
        this.character = character;
    }
}