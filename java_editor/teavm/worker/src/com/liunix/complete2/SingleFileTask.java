package com.liunix.complete2;

import java.io.File;
import java.io.OutputStreamWriter;
import java.util.Arrays;

import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

import com.sun.source.util.JavacTask;
import com.sun.tools.javac.api.JavacTool;

/**
 * SingleFileTask
 */
public class SingleFileTask {

    public static JavacTask task;

    private static final String SOURCE_FILE_NAME = "Main.java";

    //TODO: content暂时不用
    public static JavacTask buildTask_old(String filePath,String content){
        // JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        // StandardJavaFileManager manager = compiler.getStandardFileManager(null, null, null);
        // File file = new File(filePath.toString());
        // Iterable<? extends JavaFileObject> sources = manager.getJavaFileObjectsFromFiles(Arrays.asList(file));
        // DiagnosticCollector<JavaFileObject> diagnosticCollector = new DiagnosticCollector<>();
        // JavacTask task = (JavacTask)compiler.getTask(null, manager, diagnosticCollector, Arrays.asList("-proc:none", "-g","-Xbootclasspath/p:/home/liunix/" + ".m2/repository/com/google/errorprone/javac/1.8.0-u20/javac-1.8.0-u20.jar"), null, sources);
        return task;
    }

    public static JavacTask buildTask(String filePath,String content){
        JavaCompiler compiler = JavacTool.create();
        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
        Iterable<? extends JavaFileObject>  compilationUnits = fileManager.getJavaFileObjectsFromFiles(Arrays.asList(new File("/" + SOURCE_FILE_NAME)));
        File outDir = new File("/out");
        if (outDir.exists()) {
            removeDirectory(outDir);
        }
        new File("/out").mkdirs();
        OutputStreamWriter out = new OutputStreamWriter(System.out);

        return (JavacTask)compiler.getTask(out, fileManager, null,Arrays.asList("-verbose", "-d", "/out", "-Xlint:all"), null, compilationUnits);
    }

    private static void removeDirectory(File dir) {
        for (File file : dir.listFiles()) {
            if (file.isDirectory()) {
                removeDirectory(file);
            } else {
                file.delete();
            }
        }
        dir.delete();
    }
    
}