"use strict";
function $rt_setCloneMethod(target, f) {
    target.$clone = f;
}
function $rt_cls(cls) {
    return jl_Class_getClass(cls);
}
function $rt_str(str) {
    if (str === null) {
        return null;
    }
    var characters = $rt_createCharArray(str.length);
    var charsBuffer = characters.data;
    for (var i = 0; i < str.length; i = (i + 1) | 0) {
        charsBuffer[i] = str.charCodeAt(i) & 0xFFFF;
    }
    return jl_String__init_(characters);
}
function $rt_ustr(str) {
    if (str === null) {
        return null;
    }
    var result = "";
    var sz = jl_String_length(str);
    var array = $rt_createCharArray(sz);
    jl_String_getChars(str, 0, sz, array, 0);
    for (var i = 0; i < sz; i = (i + 1) | 0) {
        result += String.fromCharCode(array.data[i]);
    }
    return result;
}
function $rt_objcls() { return jl_Object; }
function $rt_nullCheck(val) {
    if (val === null) {
        $rt_throw(jl_NullPointerException__init_());
    }
    return val;
}
function $rt_intern(str) {
    return jl_String_intern(str);
}
function $rt_getThread() {
    return jl_Thread_currentThread();
}
function $rt_setThread(t) {
    return jl_Thread_setCurrentThread(t);
}
function jl_Object() {
    this.$monitor = null;
    this.$id$ = 0;
}
function jl_Object__init_() {
    var $r = new jl_Object();
    jl_Object__init_1($r);
    return $r;
}
function jl_Object_monitorEnterSync($o) {
    var var$2;
    if ($o.$monitor === null) {
        $o.$monitor = jl_Object$Monitor__init_();
    }
    var$2 = $o.$monitor;
    if (var$2.$owner === null) {
        $o.$monitor.$owner = jl_Thread_currentThread();
    } else if ($o.$monitor.$owner !== jl_Thread_currentThread()) {
        $rt_throw(jl_IllegalStateException__init_($rt_s(0)));
    }
    $o = $o.$monitor;
    $o.$count = $o.$count + 1 | 0;
}
function jl_Object_monitorExitSync($o) {
    var var$2, var$3;
    if (jl_Object_isEmptyMonitor($o) == 0) {
        var$2 = $o.$monitor;
        if (var$2.$owner === jl_Thread_currentThread()) {
            var$2 = $o.$monitor;
            var$3 = var$2.$count - 1 | 0;
            var$2.$count = var$3;
            if (var$3 == 0) {
                $o.$monitor.$owner = null;
            }
            jl_Object_isEmptyMonitor($o);
            return;
        }
    }
    $rt_throw(jl_IllegalMonitorStateException__init_());
}
function jl_Object_monitorEnter($o) {
    var var$2, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$2 = $thread.pop();$o = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        var$2 = 1;
        $ptr = 1;
    case 1:
        jl_Object_monitorEnter1($o, var$2);
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($o, var$2, $ptr);
}
function jl_Object_monitorEnter1($o, $count) {
    var var$3, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$3 = $thread.pop();$count = $thread.pop();$o = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        if ($o.$monitor === null) {
            $o.$monitor = jl_Object$Monitor__init_();
        }
        var$3 = $o.$monitor;
        if (var$3.$owner === null) {
            $o.$monitor.$owner = jl_Thread_currentThread();
        }
        if ($o.$monitor.$owner === jl_Thread_currentThread()) {
            $o = $o.$monitor;
            $o.$count = $o.$count + $count | 0;
            return;
        }
        $ptr = 1;
    case 1:
        jl_Object_monitorEnterWait($o, $count);
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($o, $count, var$3, $ptr);
}
function jl_Object_monitorEnterWait(var$1, var$2) {
    var thread = $rt_nativeThread();
    var javaThread = $rt_getThread();
    if (thread.isResuming()) {
        thread.status = 0;
        var result = thread.attribute;
        if (result instanceof Error) {
            throw result;
        }
        return result;
    }
    var callback = function() {};
    callback.$complete = function(val) {
        thread.attribute = val;
        $rt_setThread(javaThread);
        thread.resume();
    };
    callback.$error = function(e) {
        thread.attribute = $rt_exception(e);
        $rt_setThread(javaThread);
        thread.resume();
    };
    callback = otpp_AsyncCallbackWrapper_create(callback);
    return thread.suspend(function() {
        try {
            jl_Object_monitorEnterWait1(var$1, var$2, callback);
        } catch($e) {
            callback.$error($rt_exception($e));
        }
    });
}
function jl_Object_monitorEnterWait1($o, $count, $callback) {
    var $thread, var$5;
    $thread = jl_Thread_currentThread();
    if ($o.$monitor === null) {
        $o.$monitor = jl_Object$Monitor__init_();
        jl_Thread_setCurrentThread($thread);
        $o = $o.$monitor;
        $o.$count = $o.$count + $count | 0;
        otpp_AsyncCallbackWrapper_complete($callback, null);
        return;
    }
    var$5 = $o.$monitor;
    if (var$5.$owner !== null) {
        otp_PlatformQueue_add$static($o.$monitor.$enteringThreads, $$LAMBDA15$$__init_($thread, $o, $count, $callback));
        return;
    }
    $o.$monitor.$owner = $thread;
    jl_Thread_setCurrentThread($thread);
    $o = $o.$monitor;
    $o.$count = $o.$count + $count | 0;
    otpp_AsyncCallbackWrapper_complete($callback, null);
}
function jl_Object_monitorExit($o) {
    jl_Object_monitorExit1($o, 1);
}
function jl_Object_monitorExit1($o, $count) {
    var var$3;
    if (jl_Object_isEmptyMonitor($o) == 0) {
        var$3 = $o.$monitor;
        if (var$3.$owner === jl_Thread_currentThread()) {
            var$3 = $o.$monitor;
            var$3.$count = var$3.$count - $count | 0;
            if ($o.$monitor.$count > 0) {
                return;
            }
            $o.$monitor.$owner = null;
            if (otp_PlatformQueue_isEmpty$static($o.$monitor.$enteringThreads) != 0) {
                jl_Object_isEmptyMonitor($o);
            } else {
                otp_Platform_postpone($$LAMBDA14$$__init_($o));
            }
            return;
        }
    }
    $rt_throw(jl_IllegalMonitorStateException__init_());
}
function jl_Object_isEmptyMonitor($this) {
    var var$1;
    if ($this.$monitor === null) {
        return 1;
    }
    var$1 = $this.$monitor;
    if (var$1.$owner === null && otp_PlatformQueue_isEmpty$static($this.$monitor.$enteringThreads) != 0 && otp_PlatformQueue_isEmpty$static($this.$monitor.$notifyListeners) != 0) {
        $this.$monitor = null;
        return 1;
    }
    return 0;
}
function jl_Object_holdsLock($o) {
    var var$2;
    a: {
        if ($o.$monitor !== null) {
            $o = $o.$monitor;
            if ($o.$owner === jl_Thread_currentThread()) {
                var$2 = 1;
                break a;
            }
        }
        var$2 = 0;
    }
    return var$2;
}
function jl_Object__init_1($this) {
    return;
}
function jl_Object_getClass($this) {
    return jl_Class_getClass($this.constructor);
}
function jl_Object_clone($this) {
    var $result, var$2, var$3;
    if ($rt_isInstance($this, jl_Cloneable) == 0) {
        $result = $this;
        if ($result.constructor.$meta.item === null) {
            $rt_throw(jl_CloneNotSupportedException__init_());
        }
    }
    $result = otp_Platform_clone($this);
    var$2 = $result;
    var$3 = $rt_nextId();
    var$2.$id$ = var$3;
    return $result;
}
function jl_Object_notifyAll($this) {
    var $listeners, $listener;
    if (jl_Object_holdsLock($this) == 0) {
        $rt_throw(jl_IllegalMonitorStateException__init_());
    }
    $listeners = $this.$monitor;
    $listeners = $listeners.$notifyListeners;
    while (otp_PlatformQueue_isEmpty$static($listeners) == 0) {
        $listener = otp_PlatformQueue_remove$static($listeners);
        if ($listener.$expired() == 0) {
            otp_Platform_postpone($listener);
        }
    }
}
function jl_Object_wrap($obj) {
    return $obj;
}
function jl_Object_lambda$monitorExit$1($o) {
    var var$2;
    if (jl_Object_isEmptyMonitor($o) == 0) {
        var$2 = $o.$monitor;
        if (var$2.$owner === null) {
            if (otp_PlatformQueue_isEmpty$static($o.$monitor.$enteringThreads) == 0) {
                $$LAMBDA15$$_run(otp_PlatformQueue_remove$static($o.$monitor.$enteringThreads));
            }
            return;
        }
    }
}
function jl_Object_lambda$monitorEnterWait$0($thread, $o, $count, $callback) {
    jl_Thread_setCurrentThread($thread);
    $o.$monitor.$owner = $thread;
    $thread = $o.$monitor;
    $thread.$count = $thread.$count + $count | 0;
    otpp_AsyncCallbackWrapper_complete($callback, null);
}
function otju_Client() {
    jl_Object.call(this);
}
var otju_Client_worker = null;
var otju_Client_compileButton = null;
var otju_Client_examplesButton = null;
var otju_Client_stdoutElement = null;
var otju_Client_lastId = 0;
var otju_Client_codeMirror = null;
var otju_Client_positionIndexer = null;
var otju_Client_gutterElements = null;
var otju_Client_gutterSeverity = null;
var otju_Client_examplesDialog = null;
var otju_Client_examplesBackdrop = null;
var otju_Client_examplesBaseUrl = null;
var otju_Client_categories = null;
var otju_Client_frame = null;
var otju_Client_listener = null;
function otju_Client_$callClinit() {
    otju_Client_$callClinit = function(){};
    otju_Client__clinit_();
}
function otju_Client_main($args) {
    var var$2, var$3, var$4, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$4 = $thread.pop();var$3 = $thread.pop();var$2 = $thread.pop();$args = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        otju_Client_$callClinit();
        otju_Client_frame = otjdh_HTMLDocument_current().getElementById("result");
        otju_Client_initEditor();
        otju_Client_initExamples();
        otju_Client_initStdout();
        $ptr = 1;
    case 1:
        otju_Client_init();
        if ($rt_suspending()) {
            break main;
        }
        var$2 = otju_Client_compileButton;
        var$3 = $rt_s(1);
        var$4 = $$LAMBDA0$$__init_();
        var$2.addEventListener($rt_ustr(var$3), otji_JS_function(var$4, "handleEvent"));
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($args, var$2, var$3, var$4, $ptr);
}
function otju_Client_initEditor() {
    var $config, var$2, var$3, var$4;
    otju_Client_$callClinit();
    $config = {  };
    var$2 = 4;
    $config.indentUnit = var$2;
    var$2 = !!1;
    $config.lineNumbers = var$2;
    var$3 = $rt_createArray(jl_String, 2);
    var$4 = var$3.data;
    var$4[0] = $rt_s(2);
    var$4[1] = $rt_s(3);
    var$2 = otji_JS_wrap(var$3);
    $config.gutters = var$2;
    otju_Client_codeMirror = CodeMirror.fromTextArea(otjdh_HTMLDocument_current().getElementById("source-code"), $config);
    otju_Client_loadCode();
    otjb_WindowEventTarget_listenBeforeOnload$static(window, $$LAMBDA1$$__init_());
    otjde_FocusEventTarget_listenBlur$static(window, $$LAMBDA2$$__init_());
}
function otju_Client_initExamples() {
    var $document, $chooseButton, $cancelButton, $request;
    otju_Client_$callClinit();
    $document = otjdh_HTMLDocument_current();
    $chooseButton = otj_JSObject_cast$static($document.getElementById("choose-example"));
    otjde_MouseEventTarget_listenClick$static($chooseButton, $$LAMBDA3$$__init_());
    $cancelButton = otj_JSObject_cast$static($document.getElementById("cancel-example-selection"));
    otjde_MouseEventTarget_listenClick$static($cancelButton, $$LAMBDA4$$__init_());
    $request = new XMLHttpRequest() ;
    $chooseButton = $rt_s(4);
    $document = jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), otju_Client_examplesBaseUrl), $rt_s(5)));
    $request.open($rt_ustr($chooseButton), $rt_ustr($document));
    otja_XMLHttpRequest_onComplete$static($request, $$LAMBDA5$$__init_($request));
    $request.send();
}
function otju_Client_loadExamples($object) {
    var var$2, var$3, var$4, $key, $category, $categoryObject, $categoryItems, var$9, var$10, var$11, $itemKey, $itemTitle;
    otju_Client_$callClinit();
    var$2 = otji_JS_unwrapStringArray(Object.keys($object)).data;
    var$3 = var$2.length;
    var$4 = 0;
    while (var$4 < var$3) {
        $key = var$2[var$4];
        $category = otju_Client$ExampleCategory__init_();
        $categoryObject = $object[$rt_ustr($key)];
        $category.$title = $rt_str($categoryObject.title);
        ju_HashMap_put(otju_Client_categories, $key, $category);
        $categoryItems = $categoryObject.items;
        var$9 = otji_JS_unwrapStringArray(Object.keys($categoryItems)).data;
        var$10 = var$9.length;
        var$11 = 0;
        while (var$11 < var$10) {
            $itemKey = var$9[var$11];
            $itemTitle = $rt_str($categoryItems[$rt_ustr($itemKey)]);
            ju_LinkedHashMap_put($category.$items, $itemKey, $itemTitle);
            var$11 = var$11 + 1 | 0;
        }
        var$4 = var$4 + 1 | 0;
    }
}
function otju_Client_renderExamples() {
    var $document, $container, var$3, $categoryEntry, $category, $entry, var$7, var$8, $itemElement;
    otju_Client_$callClinit();
    $document = otjdh_HTMLDocument_current();
    $container = $document.getElementById("examples-content");
    var$3 = ju_HashMap$HashMapEntrySet_iterator(ju_HashMap_entrySet(otju_Client_categories));
    while (ju_HashMap$AbstractMapIterator_hasNext(var$3) != 0) {
        $categoryEntry = ju_HashMap$EntryIterator_next(var$3);
        $category = ju_MapEntry_getValue($categoryEntry);
        $entry = $document.createElement("h3");
        var$7 = otjdh_HTMLElement_withText$static($entry, $category.$title);
        $container.appendChild(var$7);
        var$8 = ju_LinkedHashMap$LinkedHashMapEntrySet_iterator(ju_LinkedHashMap_entrySet($category.$items));
        while (ju_LinkedHashMap$AbstractMapIterator_hasNext(var$8) != 0) {
            $entry = ju_LinkedHashMap$EntryIterator_next(var$8);
            $itemElement = $document.createElement("div");
            var$7 = otjdh_HTMLElement_withText$static($document.createElement("span"), ju_MapEntry_getValue($entry));
            $itemElement.appendChild(var$7);
            var$7 = "example-item";
            $itemElement.className = var$7;
            otjde_MouseEventTarget_listenClick$static($itemElement, $$LAMBDA12$$__init_($categoryEntry, $entry));
            $container.appendChild($itemElement);
        }
    }
}
function otju_Client_loadExample($category, $item) {
    var $document, $progressElement, var$5, var$6, $xhr;
    otju_Client_$callClinit();
    $document = otjdh_HTMLDocument_current();
    $progressElement = $document.getElementById("examples-content-progress");
    var$5 = $progressElement.style;
    var$6 = $rt_s(6);
    $document = $rt_s(7);
    var$5.setProperty($rt_ustr(var$6), $rt_ustr($document));
    $xhr = new XMLHttpRequest() ;
    $document = $rt_s(4);
    $category = jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), otju_Client_examplesBaseUrl), $rt_s(8)), $category), $rt_s(8)), $item), $rt_s(9)));
    $xhr.open($rt_ustr($document), $rt_ustr($category));
    otja_XMLHttpRequest_onComplete$static($xhr, $$LAMBDA13$$__init_($xhr, $progressElement));
    $xhr.send();
}
function otju_Client_showExamples() {
    var $document, var$2, var$3, var$4;
    otju_Client_$callClinit();
    $document = otjdh_HTMLDocument_current();
    var$2 = otju_Client_examplesDialog.style;
    var$3 = $rt_s(6);
    var$4 = $rt_s(7);
    var$2.setProperty($rt_ustr(var$3), $rt_ustr(var$4));
    var$3 = otju_Client_examplesDialog;
    var$4 = "modal fade in";
    var$3.className = var$4;
    otju_Client_examplesBackdrop = otjdh_HTMLElement_withAttr$static($document.createElement("div"), $rt_s(10), $rt_s(11));
    var$3 = $document.body;
    $document = otju_Client_examplesBackdrop;
    var$3.appendChild($document);
}
function otju_Client_hideExamples() {
    var var$1, var$2, var$3;
    otju_Client_$callClinit();
    var$1 = otju_Client_examplesDialog.style;
    var$2 = $rt_s(6);
    var$3 = $rt_s(12);
    var$1.setProperty($rt_ustr(var$2), $rt_ustr(var$3));
    var$2 = otju_Client_examplesDialog;
    var$3 = "modal fade";
    var$2.className = var$3;
    otjdx_Node_delete$static(otju_Client_examplesBackdrop);
    otju_Client_examplesBackdrop = null;
}
function otju_Client_initStdout() {
    var var$1, var$2, var$3;
    otju_Client_$callClinit();
    otju_Client_stdoutElement = otjdh_HTMLDocument_current().getElementById("stdout");
    var$1 = window;
    var$2 = $rt_s(13);
    var$3 = $$LAMBDA6$$__init_();
    var$1.addEventListener($rt_ustr(var$2), otji_JS_function(var$3, "handleEvent"));
}
function otju_Client_addTextToConsole($text, $compileTime) {
    var $last, $i;
    otju_Client_$callClinit();
    $last = 0;
    $i = 0;
    while ($i < jl_String_length($text)) {
        if (jl_String_charAt($text, $i) == 10) {
            otju_Client_addToConsole(jl_String_substring($text, $last, $i), $compileTime);
            $last = $i + 1 | 0;
        }
        $i = $i + 1 | 0;
    }
    otju_Client_addToConsole(jl_String_substring1($text, $last), $compileTime);
}
function otju_Client_addToConsole($line, $compileTime) {
    var $lineElem;
    otju_Client_$callClinit();
    $lineElem = otjdh_HTMLElement_withText$static(otjdh_HTMLDocument_current().createElement("div"), $line);
    if ($compileTime != 0) {
        $lineElem.className = "compile-time";
    }
    otju_Client_stdoutElement.appendChild($lineElem);
    $lineElem = otju_Client_stdoutElement;
    $line = jl_Math_max(0, otju_Client_stdoutElement.scrollHeight - otju_Client_stdoutElement.clientHeight | 0);
    $lineElem.scrollTop = $line;
}
function otju_Client_init() {
    var $stdlibLocationElem, $workerLocationElem, $loadStdlib, $loadStdlibResult, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();$loadStdlibResult = $thread.pop();$loadStdlib = $thread.pop();$workerLocationElem = $thread.pop();$stdlibLocationElem = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        otju_Client_$callClinit();
        otju_Client_compileButton.disabled = !!1;
        $stdlibLocationElem = otjdh_HTMLDocument_current().head;
        $workerLocationElem = $rt_s(14);
        $workerLocationElem = otj_JSObject_cast$static($stdlibLocationElem.querySelector($rt_ustr($workerLocationElem)));
        if ($workerLocationElem === null) {
            alert("Can\'t initialize: not workerLocation meta tag specified");
            return 0;
        }
        $loadStdlib = otjdh_HTMLDocument_current().head;
        $stdlibLocationElem = $rt_s(15);
        $stdlibLocationElem = otj_JSObject_cast$static($loadStdlib.querySelector($rt_ustr($stdlibLocationElem)));
        if ($workerLocationElem === null) {
            alert("Can\'t initialize: not stdlibLocation meta tag specified");
            return 0;
        }
        otju_Client_worker = new Worker($rt_ustr($rt_str($workerLocationElem.content))) ;
        $loadStdlib = otju_Client_createMessage($rt_s(16));
        $workerLocationElem = $rt_ustr($rt_str($stdlibLocationElem.content));
        $loadStdlib.url = $workerLocationElem;
        otju_Client_worker.postMessage($loadStdlib);
        $ptr = 1;
    case 1:
        $tmp = otju_Client_waitForResponse($loadStdlib);
        if ($rt_suspending()) {
            break main;
        }
        $loadStdlibResult = $tmp;
        if (jl_String_equals($rt_str($loadStdlibResult.command), $rt_s(17)) != 0) {
            otju_Client_compileButton.disabled = !!0;
            return 1;
        }
        alert($rt_ustr(jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), $rt_s(18)), $rt_str($loadStdlibResult.text)))));
        return 0;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($stdlibLocationElem, $workerLocationElem, $loadStdlib, $loadStdlibResult, $ptr);
}
function otju_Client_compile() {
    var $allMarks, $i, $request, $code, $response, $compilationResult, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();$compilationResult = $thread.pop();$response = $thread.pop();$code = $thread.pop();$request = $thread.pop();$i = $thread.pop();$allMarks = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        otju_Client_$callClinit();
        otjdh_HTMLElement_clear$static(otju_Client_stdoutElement);
        $allMarks = otju_Client_codeMirror.getAllMarks();
        $i = 0;
        while ($i < $allMarks.length) {
            $allMarks[$i].clear();
            $i = $i + 1 | 0;
        }
        $request = otju_Client_codeMirror;
        $allMarks = $rt_s(2);
        $request.clearGutter($rt_ustr($allMarks));
        otju_Client_gutterElements = $rt_createArray(otjdh_HTMLElement, otju_Client_codeMirror.lineCount());
        otju_Client_gutterSeverity = $rt_createIntArray(otju_Client_codeMirror.lineCount());
        $request = otju_Client_createMessage($rt_s(19));
        $code = $rt_str(otju_Client_codeMirror.getValue());
        otju_Client_positionIndexer = otju_PositionIndexer__init_($code);
        $allMarks = $rt_ustr($code);
        $request.text = $allMarks;
        otju_Client_worker.postMessage($request);
        $ptr = 1;
    case 1:
        a: {
            $tmp = otju_Client_waitForResponse($request);
            if ($rt_suspending()) {
                break main;
            }
            $response = $tmp;
            $code = $rt_str($response.command);
            $i =  -1;
            switch (jl_String_hashCode($code)) {
                case -1547904089:
                    if (jl_String_equals($code, $rt_s(20)) == 0) {
                        break a;
                    }
                    $i = 2;
                    break a;
                case 1201050005:
                    if (jl_String_equals($code, $rt_s(21)) == 0) {
                        break a;
                    }
                    $i = 1;
                    break a;
                case 1838383619:
                    if (jl_String_equals($code, $rt_s(22)) == 0) {
                        break a;
                    }
                    $i = 0;
                    break a;
                default:
            }
        }
        b: {
            switch ($i) {
                case 0:
                    $compilationResult = otj_JSObject_cast$static($response);
                    $request = jl_String_equals($rt_str($compilationResult.status), $rt_s(23)) == 0 ? null : $rt_str($compilationResult.script);
                    return $request;
                case 1:
                    break;
                case 2:
                    otju_Client_handleDiagnostic(otj_JSObject_cast$static($response));
                    break b;
                default:
                    break b;
            }
            otju_Client_handleCompilerDiagnostic(otj_JSObject_cast$static($response));
        }
        continue main;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($allMarks, $i, $request, $code, $response, $compilationResult, $ptr);
}
function otju_Client_handleCompilerDiagnostic($request) {
    var $sb, var$3, var$4, var$5;
    otju_Client_$callClinit();
    a: {
        $sb = jl_StringBuilder__init_();
        var$3 = $rt_str($request.kind);
        var$4 =  -1;
        switch (jl_String_hashCode(var$3)) {
            case -1229401354:
                if (jl_String_equals(var$3, $rt_s(24)) == 0) {
                    break a;
                }
                var$4 = 2;
                break a;
            case 66247144:
                if (jl_String_equals(var$3, $rt_s(25)) == 0) {
                    break a;
                }
                var$4 = 0;
                break a;
            case 1842428796:
                if (jl_String_equals(var$3, $rt_s(26)) == 0) {
                    break a;
                }
                var$4 = 1;
                break a;
            default:
        }
    }
    b: {
        switch (var$4) {
            case 0:
                break;
            case 1:
            case 2:
                jl_StringBuilder_append($sb, $rt_s(27));
                break b;
            default:
                break b;
        }
        jl_StringBuilder_append($sb, $rt_s(28));
    }
    if ($request.object !== null) {
        jl_StringBuilder_append($sb, jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), $rt_s(29)), $rt_str($request.object.name))));
        if ($request.lineNumber >= 0) {
            var$5 = jl_StringBuilder_append1(jl_StringBuilder_append(jl_StringBuilder_append1(jl_StringBuilder_append($sb, $rt_s(30)), $request.lineNumber + 1 | 0), $rt_s(31)), $request.columnNumber + 1 | 0);
            var$3 = $rt_s(32);
            jl_StringBuilder_append(var$5, var$3);
        }
        jl_StringBuilder_append2($sb, 32);
    }
    jl_StringBuilder_append($sb, $rt_str($request.message));
    otju_Client_addTextToConsole(jl_StringBuilder_toString($sb), 1);
    if ($request.startPosition >= 0) {
        otju_Client_displayMarkInEditor($request);
    }
}
function otju_Client_handleDiagnostic($request) {
    var $sb, var$3, $severity;
    otju_Client_$callClinit();
    $sb = jl_StringBuilder_append2(jl_StringBuilder__init_1($rt_str($request.severity)), 32);
    if ($rt_str($request.fileName) !== null) {
        jl_StringBuilder_append($sb, jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), $rt_s(29)), $rt_str($request.fileName))));
        if ($request.lineNumber >= 0) {
            jl_StringBuilder_append1(jl_StringBuilder_append($sb, $rt_s(31)), $request.lineNumber + 1 | 0);
        }
        jl_StringBuilder_append2($sb, 32);
    }
    jl_StringBuilder_append($sb, $rt_str($request.text));
    otju_Client_addTextToConsole(jl_StringBuilder_toString($sb), 1);
    if ($request.lineNumber >= 0) {
        a: {
            var$3 = $rt_str($request.severity);
            $severity =  -1;
            switch (jl_String_hashCode(var$3)) {
                case 66247144:
                    if (jl_String_equals(var$3, $rt_s(25)) == 0) {
                        break a;
                    }
                    $severity = 0;
                    break a;
                case 1842428796:
                    if (jl_String_equals(var$3, $rt_s(26)) == 0) {
                        break a;
                    }
                    $severity = 1;
                    break a;
                default:
            }
        }
        b: {
            switch ($severity) {
                case 0:
                    $severity = 2;
                    break b;
                case 1:
                    $severity = 1;
                    break b;
                default:
            }
            return;
        }
        otju_Client_addGutterDiagnostic($severity, $request.lineNumber, $rt_str($request.text));
    }
}
function otju_Client_displayMarkInEditor($request) {
    var $start, $endPosition, $end, $options, var$6, var$7, $gutterSeverity, var$9;
    otju_Client_$callClinit();
    $start = otju_PositionIndexer_getPositionAt(otju_Client_positionIndexer, $request.startPosition, 1);
    if ($start.$line >= otju_Client_gutterElements.data.length) {
        return;
    }
    $endPosition = $request.endPosition;
    if ($endPosition == $request.startPosition) {
        $endPosition = $endPosition + 1 | 0;
    }
    a: {
        $end = otju_PositionIndexer_getPositionAt(otju_Client_positionIndexer, $endPosition, 0);
        $options = {  };
        var$6 = $rt_str($request.kind);
        var$7 =  -1;
        switch (jl_String_hashCode(var$6)) {
            case -1229401354:
                if (jl_String_equals(var$6, $rt_s(24)) == 0) {
                    break a;
                }
                var$7 = 2;
                break a;
            case 66247144:
                if (jl_String_equals(var$6, $rt_s(25)) == 0) {
                    break a;
                }
                var$7 = 0;
                break a;
            case 1842428796:
                if (jl_String_equals(var$6, $rt_s(26)) == 0) {
                    break a;
                }
                var$7 = 1;
                break a;
            default:
        }
    }
    b: {
        switch (var$7) {
            case 0:
                $options.className = "red-wave";
                $gutterSeverity = 2;
                break b;
            case 1:
            case 2:
                $options.className = "yellow-wave";
                $gutterSeverity = 1;
                break b;
            default:
        }
        return;
    }
    var$6 = !!1;
    $options.inclusiveLeft = var$6;
    var$6 = !!1;
    $options.inclusiveRight = var$6;
    var$6 = $rt_ustr($rt_str($request.message));
    $options.title = var$6;
    var$6 = otju_Client_codeMirror;
    var$7 = $start.$line;
    $endPosition = $start.$column;
    var$9 = otjuc_TextLocation_create$js_body$_7(var$7, $endPosition);
    var$7 = $end.$line;
    $endPosition = $end.$column;
    $end = otjuc_TextLocation_create$js_body$_7(var$7, $endPosition);
    var$6.markText(var$9, $end, $options);
    otju_Client_addGutterDiagnostic($gutterSeverity, $start.$line, $rt_str($request.message));
}
function otju_Client_addGutterDiagnostic($severity, $line, $message) {
    var $gutterClassName, $element, $title, var$7;
    otju_Client_$callClinit();
    if (otju_Client_gutterSeverity.data[$line] < $severity) {
        otju_Client_gutterSeverity.data[$line] = $severity;
    }
    a: {
        switch (otju_Client_gutterSeverity.data[$line]) {
            case 1:
                $gutterClassName = $rt_s(33);
                break a;
            case 2:
                $gutterClassName = $rt_s(34);
                break a;
            default:
        }
        return;
    }
    $element = otju_Client_gutterElements.data[$line];
    if ($element === null) {
        $element = otjdh_HTMLDocument_current().createElement("span");
        otju_Client_gutterElements.data[$line] = $element;
    }
    $element.className = $rt_ustr(jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), $rt_s(35)), $gutterClassName)));
    $title = $rt_str($element.title);
    if (jl_String_isEmpty($title) == 0) {
        $message = jl_StringBuilder_toString(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder_append(jl_StringBuilder__init_(), $title), $rt_s(36)), $message));
    }
    $message = $rt_ustr($message);
    $element.title = $message;
    var$7 = otju_Client_codeMirror;
    $title = $rt_s(2);
    var$7.setGutterMarker($line, $rt_ustr($title), $element);
}
function otju_Client_createMessage($command) {
    var $message, var$3;
    otju_Client_$callClinit();
    $message = {  };
    $command = $rt_ustr($command);
    $message.command = $command;
    var$3 = otju_Client_lastId;
    otju_Client_lastId = var$3 + 1 | 0;
    $command = $rt_ustr(jl_String_valueOf(var$3));
    $message.id = $command;
    return $message;
}
function otju_Client_waitForResponse(var$1) {
    var thread = $rt_nativeThread();
    var javaThread = $rt_getThread();
    if (thread.isResuming()) {
        thread.status = 0;
        var result = thread.attribute;
        if (result instanceof Error) {
            throw result;
        }
        return result;
    }
    var callback = function() {};
    callback.$complete = function(val) {
        thread.attribute = val;
        $rt_setThread(javaThread);
        thread.resume();
    };
    callback.$error = function(e) {
        thread.attribute = $rt_exception(e);
        $rt_setThread(javaThread);
        thread.resume();
    };
    callback = otpp_AsyncCallbackWrapper_create(callback);
    return thread.suspend(function() {
        try {
            otju_Client_waitForResponse1(var$1, callback);
        } catch($e) {
            callback.$error($rt_exception($e));
        }
    });
}
function otju_Client_waitForResponse1($request, $callback) {
    otju_Client_$callClinit();
    otju_Client$1ResponseWait_run(otju_Client$1ResponseWait__init_($request, $callback));
}
function otju_Client_executeCode($code) {
    var $document, var$3, var$4;
    otju_Client_$callClinit();
    if (otju_Client_frame !== null) {
        otjdx_Node_delete$static(otju_Client_frame);
    }
    $document = window.document;
    otju_Client_frame = $document.createElement("iframe");
    var$3 = otju_Client_frame;
    var$4 = "frame.html";
    var$3.src = var$4;
    var$3 = otju_Client_frame;
    var$4 = "1px";
    var$3.width = var$4;
    var$3 = otju_Client_frame;
    var$4 = "1px";
    var$3.height = var$4;
    var$3 = otju_Client_frame;
    var$4 = "result";
    var$3.className = var$4;
    otju_Client_listener = $$LAMBDA16$$__init_($code);
    var$4 = window;
    var$3 = $rt_s(13);
    $code = otju_Client_listener;
    var$4.addEventListener($rt_ustr(var$3), otji_JS_function($code, "handleEvent"));
    var$3 = $document.getElementById("result-container");
    $code = otju_Client_frame;
    var$3.appendChild($code);
}
function otju_Client_loadCode() {
    var $code;
    otju_Client_$callClinit();
    $code = $rt_str(window.localStorage.getItem("teavm-java-code"));
    if ($code !== null) {
        otju_Client_codeMirror.setValue($rt_ustr($code));
    }
}
function otju_Client_saveCode() {
    var var$1, var$2, var$3;
    otju_Client_$callClinit();
    var$1 = window.localStorage;
    var$2 = $rt_s(37);
    var$3 = $rt_str(otju_Client_codeMirror.getValue());
    var$1.setItem($rt_ustr(var$2), $rt_ustr(var$3));
}
function otju_Client_lambda$executeCode$10($code, $event) {
    var $command, $codeCommand;
    otju_Client_$callClinit();
    $command = otj_JSObject_cast$static(JSON.parse($rt_ustr(otjc_JSString_stringValue$static($event.data))));
    if (jl_String_equals($rt_str($command.command), $rt_s(38)) != 0) {
        $codeCommand = {  };
        $codeCommand.command = "code";
        $codeCommand.code = $rt_ustr($code);
        otju_Client_frame.contentWindow.postMessage($rt_ustr($rt_str(JSON.stringify($codeCommand))), "*");
        window.removeEventListener("message", otji_JS_function(otju_Client_listener, "handleEvent"));
        otju_Client_listener = null;
    }
}
function otju_Client_lambda$initStdout$9($event) {
    var $request, $stdoutCommand;
    otju_Client_$callClinit();
    $request = otj_JSObject_cast$static(JSON.parse($rt_ustr(otjc_JSString_stringValue$static($event.data))));
    if (jl_String_equals($rt_str($request.command), $rt_s(39)) != 0) {
        $stdoutCommand = otj_JSObject_cast$static($request);
        otju_Client_addToConsole($rt_str($stdoutCommand.line), 0);
    }
}
function otju_Client_lambda$loadExample$8($xhr, $progressElement) {
    var $code;
    otju_Client_$callClinit();
    $code = $rt_str($xhr.responseText);
    otju_Client_codeMirror.setValue($rt_ustr($code));
    otju_Client_hideExamples();
    $code = $progressElement.style;
    $progressElement = $rt_s(6);
    $xhr = $rt_s(12);
    $code.setProperty($rt_ustr($progressElement), $rt_ustr($xhr));
}
function otju_Client_lambda$renderExamples$7($categoryEntry, $entry, $event) {
    otju_Client_$callClinit();
    otju_Client_loadExample(ju_MapEntry_getKey($categoryEntry), ju_MapEntry_getKey($entry));
}
function otju_Client_lambda$initExamples$6($request) {
    var var$2;
    otju_Client_$callClinit();
    otju_Client_loadExamples(otj_JSObject_cast$static(JSON.parse($rt_ustr($rt_str($request.responseText)))));
    otju_Client_renderExamples();
    $request = otju_Client_examplesButton;
    var$2 = !!0;
    $request.disabled = var$2;
}
function otju_Client_lambda$initExamples$5($event) {
    otju_Client_$callClinit();
    otju_Client_hideExamples();
}
function otju_Client_lambda$initExamples$4($event) {
    otju_Client_$callClinit();
    otju_Client_showExamples();
}
function otju_Client_lambda$initEditor$3($e) {
    otju_Client_$callClinit();
    otju_Client_saveCode();
}
function otju_Client_lambda$initEditor$2($e) {
    otju_Client_$callClinit();
    otju_Client_saveCode();
}
function otju_Client_lambda$main$1($event) {
    otju_Client_$callClinit();
    $event = jl_Thread__init_($$LAMBDA10$$__init_());
    jl_Thread_start($event);
}
function otju_Client_lambda$null$0() {
    var $generatedCode, var$2, var$3, $$je, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$3 = $thread.pop();var$2 = $thread.pop();$generatedCode = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        try {
            otju_Client_$callClinit();
            otju_Client_compileButton.disabled = !!1;
            $ptr = 1;
            continue main;
        } catch ($$e) {
            $$je = $$e.$javaException;
            if ($$je) {
                $generatedCode = $$je;
            } else {
                throw $$e;
            }
        }
        var$2 = otju_Client_compileButton;
        var$3 = !!0;
        var$2.disabled = var$3;
        $rt_throw($generatedCode);
    case 1:
        a: {
            try {
                $tmp = otju_Client_compile();
                if ($rt_suspending()) {
                    break main;
                }
                $generatedCode = $tmp;
                break a;
            } catch ($$e) {
                $$je = $$e.$javaException;
                if ($$je) {
                    $generatedCode = $$je;
                } else {
                    throw $$e;
                }
            }
            var$2 = otju_Client_compileButton;
            var$3 = !!0;
            var$2.disabled = var$3;
            $rt_throw($generatedCode);
        }
        otju_Client_compileButton.disabled = !!0;
        if ($generatedCode !== null) {
            otju_Client_executeCode($generatedCode);
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($generatedCode, var$2, var$3, $ptr);
}
function otju_Client_access$000() {
    otju_Client_$callClinit();
    return otju_Client_worker;
}
function otju_Client_access$100($x0) {
    otju_Client_$callClinit();
    return otju_Client_isMessage$js_body$_11($x0) ? 1 : 0;
}
function otju_Client__clinit_() {
    otju_Client_compileButton = otj_JSObject_cast$static(otjdh_HTMLDocument_current().getElementById("compile-button"));
    otju_Client_examplesButton = otj_JSObject_cast$static(otjdh_HTMLDocument_current().getElementById("choose-example"));
    otju_Client_examplesDialog = otjdh_HTMLDocument_current().getElementById("examples");
    otju_Client_examplesBaseUrl = $rt_s(40);
    otju_Client_categories = ju_HashMap__init_();
}
function otju_Client_isMessage$js_body$_11(var$1) {
    return 'id' in var$1 && typeof var$1.id === 'string';
}
function otj_JSObject() {
    jl_Object.call(this);
}
function otj_JSObject_cast$static($this) {
    return $this;
}
function otjdx_Node() {
    jl_Object.call(this);
}
function otjdx_Node_delete$static($this) {
    if ($this.parentNode !== null) {
        $this.parentNode.removeChild($this);
    }
}
function otjdx_Document() {
    jl_Object.call(this);
}
function otjde_EventTarget() {
    jl_Object.call(this);
}
function otjdh_HTMLDocument() {
    jl_Object.call(this);
}
function otjdh_HTMLDocument_current() {
    return window.document;
}
function otji_JS() {
    jl_Object.call(this);
}
function otji_JS_wrap($array) {
    var var$2, $result, $i, var$5;
    if ($array === null) {
        return null;
    }
    $array = $array.data;
    var$2 = $array.length;
    $result = new Array(var$2) ;
    $i = 0;
    while ($i < var$2) {
        var$5 = $rt_ustr($array[$i]);
        $result[$i] = var$5;
        $i = $i + 1 | 0;
    }
    return $result;
}
function otji_JS_unwrapStringArray($array) {
    var $result, $i, var$4;
    if ($array === null) {
        return null;
    }
    $result = $rt_createArray(jl_String, $array.length);
    $i = 0;
    while (true) {
        var$4 = $result.data;
        if ($i >= var$4.length) {
            break;
        }
        var$4[$i] = otjc_JSString_stringValue$static($array[$i]);
        $i = $i + 1 | 0;
    }
    return $result;
}
function otji_JS_function(var$1, var$2) {
    var name = 'jso$functor$' + var$2;
    if (!var$1[name]) {
        var fn = function() {
            return var$1[var$2].apply(var$1, arguments);
        };
        var$1[name] = function() {
            return fn;
        };
    }
    return var$1[name]();
}
function otji_JS_functionAsObject(var$1, var$2) {
    if (var$1 === null) return null;
    var result = {};
    result[var$2] = var$1;
    return result;
}
function otjde_EventListener() {
    jl_Object.call(this);
}
function $$LAMBDA0$$() {
    jl_Object.call(this);
}
function $$LAMBDA0$$__init_() {
    var $r = new $$LAMBDA0$$();
    $$LAMBDA0$$__init_1($r);
    return $r;
}
function $$LAMBDA0$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA0$$_handleEvent(var$0, var$1) {
    otju_Client_lambda$main$1(var$1);
}
function $$LAMBDA0$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA0$$_handleEvent(var$0, var$1);
}
function jlr_AnnotatedElement() {
    jl_Object.call(this);
}
function jl_Class() {
    jl_Object.call(this);
    this.$platformClass = null;
}
function jl_Class__init_(var_1) {
    var $r = new jl_Class();
    jl_Class__init_1($r, var_1);
    return $r;
}
function jl_Class__init_1($this, $platformClass) {
    var var$2;
    jl_Object__init_1($this);
    $this.$platformClass = $platformClass;
    var$2 = $this;
    $platformClass.classObject = var$2;
}
function jl_Class_getClass($cls) {
    var $result;
    if ($cls === null) {
        return null;
    }
    $result = $cls.classObject;
    if ($result === null) {
        $result = jl_Class__init_($cls);
    }
    return $result;
}
function jl_Class_getPlatformClass($this) {
    return $this.$platformClass;
}
function jl_Class_getComponentType($this) {
    return jl_Class_getClass(otp_Platform_getArrayItem($this.$platformClass));
}
function otp_Platform() {
    jl_Object.call(this);
}
function otp_Platform_clone(var$1) {
    var copy = new var$1.constructor();
    for (var field in var$1) {
        if (!var$1.hasOwnProperty(field)) {
            continue;
        }
        copy[field] = var$1[field];
    }
    return copy;
}
function otp_Platform_startThread(var$1) {
    return setTimeout(function() {
        $rt_threadStarter(otp_Platform_launchThread)(var$1);
    }, 0);
}
function otp_Platform_launchThread($runnable) {
    var $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();$runnable = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        $ptr = 1;
    case 1:
        $runnable.$run();
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($runnable, $ptr);
}
function otp_Platform_postpone($runnable) {
    otp_Platform_schedule($runnable, 0);
}
function otp_Platform_schedule(var$1, var$2) {
    return setTimeout(function() {
        otp_Platform_launchThread(var$1);
    }, var$2);
}
function otp_Platform_getArrayItem($cls) {
    return $cls.$meta.item;
}
function ji_Serializable() {
    jl_Object.call(this);
}
function jl_Comparable() {
    jl_Object.call(this);
}
function jl_CharSequence() {
    jl_Object.call(this);
}
function jl_String() {
    var a = this; jl_Object.call(a);
    a.$characters = null;
    a.$hashCode1 = 0;
}
var jl_String_CASE_INSENSITIVE_ORDER = null;
var jl_String_pool = null;
function jl_String_$callClinit() {
    jl_String_$callClinit = function(){};
    jl_String__clinit_();
}
function jl_String__init_(var_1) {
    var $r = new jl_String();
    jl_String__init_1($r, var_1);
    return $r;
}
function jl_String__init_2(var_1, var_2, var_3) {
    var $r = new jl_String();
    jl_String__init_3($r, var_1, var_2, var_3);
    return $r;
}
function jl_String__init_1($this, $characters) {
    var var$2, $i;
    jl_String_$callClinit();
    $characters = $characters.data;
    jl_Object__init_1($this);
    var$2 = $characters.length;
    $this.$characters = $rt_createCharArray(var$2);
    $i = 0;
    while ($i < var$2) {
        $this.$characters.data[$i] = $characters[$i];
        $i = $i + 1 | 0;
    }
}
function jl_String__init_3($this, $value, $offset, $count) {
    var $i, var$5;
    jl_String_$callClinit();
    jl_Object__init_1($this);
    $this.$characters = $rt_createCharArray($count);
    $i = 0;
    while ($i < $count) {
        var$5 = $value.data;
        $this.$characters.data[$i] = var$5[$i + $offset | 0];
        $i = $i + 1 | 0;
    }
}
function jl_String_charAt($this, $index) {
    if ($index >= 0 && $index < $this.$characters.data.length) {
        return $this.$characters.data[$index];
    }
    $rt_throw(jl_StringIndexOutOfBoundsException__init_());
}
function jl_String_length($this) {
    return $this.$characters.data.length;
}
function jl_String_isEmpty($this) {
    return $this.$characters.data.length != 0 ? 0 : 1;
}
function jl_String_getChars($this, $srcBegin, $srcEnd, $dst, $dstBegin) {
    var var$5, var$6;
    if ($srcBegin >= 0 && $srcBegin <= $srcEnd && $srcEnd <= $this.$length() && $dstBegin >= 0) {
        $dst = $dst.data;
        if (($dstBegin + ($srcEnd - $srcBegin | 0) | 0) <= $dst.length) {
            while ($srcBegin < $srcEnd) {
                var$5 = $dstBegin + 1 | 0;
                var$6 = $srcBegin + 1 | 0;
                $dst[$dstBegin] = $this.$charAt($srcBegin);
                $dstBegin = var$5;
                $srcBegin = var$6;
            }
            return;
        }
    }
    $rt_throw(jl_IndexOutOfBoundsException__init_());
}
function jl_String_substring($this, $beginIndex, $endIndex) {
    if ($beginIndex > $endIndex) {
        $rt_throw(jl_IndexOutOfBoundsException__init_());
    }
    return jl_String__init_2($this.$characters, $beginIndex, $endIndex - $beginIndex | 0);
}
function jl_String_substring1($this, $beginIndex) {
    return jl_String_substring($this, $beginIndex, jl_String_length($this));
}
function jl_String_valueOf($i) {
    jl_String_$callClinit();
    return jl_String_wrap(jl_StringBuilder_toString(jl_StringBuilder_append1(jl_StringBuilder__init_(), $i)));
}
function jl_String_equals($this, $other) {
    var $str, $i;
    if ($this === $other) {
        return 1;
    }
    if ($other instanceof jl_String == 0) {
        return 0;
    }
    $str = $other;
    if (jl_String_length($str) != jl_String_length($this)) {
        return 0;
    }
    $i = 0;
    while ($i < jl_String_length($str)) {
        if (jl_String_charAt($this, $i) != jl_String_charAt($str, $i)) {
            return 0;
        }
        $i = $i + 1 | 0;
    }
    return 1;
}
function jl_String_hashCode($this) {
    var var$1, var$2, var$3, $c;
    if ($this.$hashCode1 == 0) {
        var$1 = $this.$characters.data;
        var$2 = var$1.length;
        var$3 = 0;
        while (var$3 < var$2) {
            $c = var$1[var$3];
            $this.$hashCode1 = (31 * $this.$hashCode1 | 0) + $c | 0;
            var$3 = var$3 + 1 | 0;
        }
    }
    return $this.$hashCode1;
}
function jl_String_wrap($str) {
    jl_String_$callClinit();
    return $str;
}
function jl_String_intern($this) {
    var $interned;
    $interned = ju_HashMap_get(jl_String_pool, $this);
    if ($interned !== null) {
        $this = $interned;
    } else {
        ju_HashMap_put(jl_String_pool, $this, $this);
    }
    return $this;
}
function jl_String__clinit_() {
    jl_String_CASE_INSENSITIVE_ORDER = $$LAMBDA8$$__init_();
    jl_String_pool = ju_HashMap__init_();
}
function jl_Throwable() {
    var a = this; jl_Object.call(a);
    a.$message = null;
    a.$suppressionEnabled = 0;
    a.$writableStackTrace = 0;
}
function jl_Throwable__init_() {
    var $r = new jl_Throwable();
    jl_Throwable__init_1($r);
    return $r;
}
function jl_Throwable__init_2(var_1) {
    var $r = new jl_Throwable();
    jl_Throwable__init_3($r, var_1);
    return $r;
}
function jl_Throwable__init_1($this) {
    $this.$suppressionEnabled = 1;
    $this.$writableStackTrace = 1;
    jl_Throwable_fillInStackTrace($this);
}
function jl_Throwable__init_3($this, $message) {
    $this.$suppressionEnabled = 1;
    $this.$writableStackTrace = 1;
    jl_Throwable_fillInStackTrace($this);
    $this.$message = $message;
}
function jl_Throwable_fillInStackTrace($this) {
    return $this;
}
function jl_Exception() {
    jl_Throwable.call(this);
}
function jl_Exception__init_() {
    var $r = new jl_Exception();
    jl_Exception__init_1($r);
    return $r;
}
function jl_Exception__init_2(var_1) {
    var $r = new jl_Exception();
    jl_Exception__init_3($r, var_1);
    return $r;
}
function jl_Exception__init_1($this) {
    jl_Throwable__init_1($this);
}
function jl_Exception__init_3($this, $message) {
    jl_Throwable__init_3($this, $message);
}
function jl_RuntimeException() {
    jl_Exception.call(this);
}
function jl_RuntimeException__init_() {
    var $r = new jl_RuntimeException();
    jl_RuntimeException__init_1($r);
    return $r;
}
function jl_RuntimeException__init_1($this) {
    jl_Exception__init_1($this);
}
function jl_IndexOutOfBoundsException() {
    jl_RuntimeException.call(this);
}
function jl_IndexOutOfBoundsException__init_() {
    var $r = new jl_IndexOutOfBoundsException();
    jl_IndexOutOfBoundsException__init_1($r);
    return $r;
}
function jl_IndexOutOfBoundsException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function jl_Cloneable() {
    jl_Object.call(this);
}
function jl_CloneNotSupportedException() {
    jl_Exception.call(this);
}
function jl_CloneNotSupportedException__init_() {
    var $r = new jl_CloneNotSupportedException();
    jl_CloneNotSupportedException__init_1($r);
    return $r;
}
function jl_CloneNotSupportedException__init_1($this) {
    jl_Exception__init_1($this);
}
function jl_Runnable() {
    jl_Object.call(this);
}
function jl_Thread() {
    var a = this; jl_Object.call(a);
    a.$id = Long_ZERO;
    a.$timeSliceStart = Long_ZERO;
    a.$finishedLock = null;
    a.$name = null;
    a.$alive = 0;
    a.$target = null;
}
var jl_Thread_mainThread = null;
var jl_Thread_currentThread1 = null;
var jl_Thread_nextId = Long_ZERO;
var jl_Thread_activeCount = 0;
function jl_Thread_$callClinit() {
    jl_Thread_$callClinit = function(){};
    jl_Thread__clinit_();
}
function jl_Thread__init_1(var_1) {
    var $r = new jl_Thread();
    jl_Thread__init_2($r, var_1);
    return $r;
}
function jl_Thread__init_(var_1) {
    var $r = new jl_Thread();
    jl_Thread__init_3($r, var_1);
    return $r;
}
function jl_Thread__init_4(var_1, var_2) {
    var $r = new jl_Thread();
    jl_Thread__init_5($r, var_1, var_2);
    return $r;
}
function jl_Thread__init_2($this, $name) {
    jl_Thread_$callClinit();
    jl_Thread__init_5($this, null, $name);
}
function jl_Thread__init_3($this, $target) {
    jl_Thread_$callClinit();
    jl_Thread__init_5($this, $target, null);
}
function jl_Thread__init_5($this, $target, $name) {
    var var$3;
    jl_Thread_$callClinit();
    jl_Object__init_1($this);
    $this.$finishedLock = jl_Object__init_();
    $this.$alive = 1;
    $this.$name = $name;
    $this.$target = $target;
    var$3 = jl_Thread_nextId;
    jl_Thread_nextId = Long_add(var$3, Long_fromInt(1));
    $this.$id = var$3;
}
function jl_Thread_start($this) {
    otp_Platform_startThread($$LAMBDA11$$__init_($this));
}
function jl_Thread_setCurrentThread($thread) {
    jl_Thread_$callClinit();
    if (jl_Thread_currentThread1 !== $thread) {
        jl_Thread_currentThread1 = $thread;
    }
    jl_Thread_currentThread1.$timeSliceStart = jl_System_currentTimeMillis();
}
function jl_Thread_getMainThread() {
    jl_Thread_$callClinit();
    return jl_Thread_mainThread;
}
function jl_Thread_run($this) {
    var var$1, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$1 = $thread.pop();$this = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        if ($this.$target === null) {
            return;
        }
        var$1 = $this.$target;
        $ptr = 1;
    case 1:
        $$LAMBDA10$$_run(var$1);
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($this, var$1, $ptr);
}
function jl_Thread_currentThread() {
    jl_Thread_$callClinit();
    return jl_Thread_currentThread1;
}
function jl_Thread_lambda$start$0($this) {
    var var$1, var$2, $$je, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$2 = $thread.pop();var$1 = $thread.pop();$this = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        try {
            jl_Thread_activeCount = jl_Thread_activeCount + 1 | 0;
            jl_Thread_setCurrentThread($this);
            $ptr = 2;
            continue main;
        } catch ($$e) {
            $$je = $$e.$javaException;
            if ($$je) {
                var$1 = $$je;
            } else {
                throw $$e;
            }
        }
        var$2 = $this.$finishedLock;
        $ptr = 1;
    case 1:
        jl_Object_monitorEnter(var$2);
        if ($rt_suspending()) {
            break main;
        }
        a: {
            try {
                jl_Object_notifyAll($this.$finishedLock);
                jl_Object_monitorExit(var$2);
                break a;
            } catch ($$e) {
                $$je = $$e.$javaException;
                if ($$je) {
                    var$1 = $$je;
                } else {
                    throw $$e;
                }
            }
            jl_Object_monitorExit(var$2);
            $rt_throw(var$1);
        }
        $this.$alive = 0;
        jl_Thread_activeCount = jl_Thread_activeCount - 1 | 0;
        jl_Thread_setCurrentThread(jl_Thread_mainThread);
        $rt_throw(var$1);
    case 2:
        a: {
            try {
                jl_Thread_run($this);
                if ($rt_suspending()) {
                    break main;
                }
            } catch ($$e) {
                $$je = $$e.$javaException;
                if ($$je) {
                    var$1 = $$je;
                    break a;
                } else {
                    throw $$e;
                }
            }
            var$1 = $this.$finishedLock;
            $ptr = 3;
            continue main;
        }
        var$2 = $this.$finishedLock;
        $ptr = 1;
        continue main;
    case 3:
        jl_Object_monitorEnter(var$1);
        if ($rt_suspending()) {
            break main;
        }
        a: {
            try {
                jl_Object_notifyAll($this.$finishedLock);
                jl_Object_monitorExit(var$1);
                break a;
            } catch ($$e) {
                $$je = $$e.$javaException;
                if ($$je) {
                    var$2 = $$je;
                } else {
                    throw $$e;
                }
            }
            jl_Object_monitorExit(var$1);
            $rt_throw(var$2);
        }
        $this.$alive = 0;
        jl_Thread_activeCount = jl_Thread_activeCount - 1 | 0;
        jl_Thread_setCurrentThread(jl_Thread_mainThread);
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push($this, var$1, var$2, $ptr);
}
function jl_Thread__clinit_() {
    jl_Thread_mainThread = jl_Thread__init_1(jl_String_wrap($rt_s(41)));
    jl_Thread_currentThread1 = jl_Thread_mainThread;
    jl_Thread_nextId = Long_fromInt(1);
    jl_Thread_activeCount = 1;
}
function jl_System() {
    jl_Object.call(this);
}
var jl_System_out = null;
var jl_System_err = null;
var jl_System_in = null;
function jl_System_$callClinit() {
    jl_System_$callClinit = function(){};
    jl_System__clinit_();
}
function jl_System_currentTimeMillis() {
    jl_System_$callClinit();
    return Long_fromNumber(new Date().getTime());
}
function jl_System__clinit_() {
    jl_System_out = ji_PrintStream__init_(jl_ConsoleOutputStreamStdout__init_(), 0);
    jl_System_err = ji_PrintStream__init_(jl_ConsoleOutputStreamStderr__init_(), 0);
    jl_System_in = jl_ConsoleInputStream__init_();
}
function jl_Error() {
    jl_Throwable.call(this);
}
function jl_Error__init_(var_1) {
    var $r = new jl_Error();
    jl_Error__init_1($r, var_1);
    return $r;
}
function jl_Error__init_1($this, $message) {
    jl_Throwable__init_3($this, $message);
}
function jl_LinkageError() {
    jl_Error.call(this);
}
function jl_LinkageError__init_(var_1) {
    var $r = new jl_LinkageError();
    jl_LinkageError__init_1($r, var_1);
    return $r;
}
function jl_LinkageError__init_1($this, $message) {
    jl_Error__init_1($this, $message);
}
function jl_NoClassDefFoundError() {
    jl_LinkageError.call(this);
}
function jl_IncompatibleClassChangeError() {
    jl_LinkageError.call(this);
}
function jl_IncompatibleClassChangeError__init_(var_1) {
    var $r = new jl_IncompatibleClassChangeError();
    jl_IncompatibleClassChangeError__init_1($r, var_1);
    return $r;
}
function jl_IncompatibleClassChangeError__init_1($this, $message) {
    jl_LinkageError__init_1($this, $message);
}
function jl_NoSuchFieldError() {
    jl_IncompatibleClassChangeError.call(this);
}
function jl_NoSuchFieldError__init_(var_1) {
    var $r = new jl_NoSuchFieldError();
    jl_NoSuchFieldError__init_1($r, var_1);
    return $r;
}
function jl_NoSuchFieldError__init_1($this, $message) {
    jl_IncompatibleClassChangeError__init_1($this, $message);
}
function jl_NoSuchMethodError() {
    jl_IncompatibleClassChangeError.call(this);
}
function jl_NoSuchMethodError__init_(var_1) {
    var $r = new jl_NoSuchMethodError();
    jl_NoSuchMethodError__init_1($r, var_1);
    return $r;
}
function jl_NoSuchMethodError__init_1($this, $message) {
    jl_IncompatibleClassChangeError__init_1($this, $message);
}
function otjde_FocusEventTarget() {
    jl_Object.call(this);
}
function otjde_FocusEventTarget_listenBlur$static($this, $listener) {
    var var$3;
    var$3 = $rt_s(42);
    $this.addEventListener($rt_ustr(var$3), otji_JS_function($listener, "handleEvent"));
}
function otjde_MouseEventTarget() {
    jl_Object.call(this);
}
function otjde_MouseEventTarget_listenClick$static($this, $listener) {
    var var$3;
    var$3 = $rt_s(1);
    $this.addEventListener($rt_ustr(var$3), otji_JS_function($listener, "handleEvent"));
}
function otjde_KeyboardEventTarget() {
    jl_Object.call(this);
}
function otjde_LoadEventTarget() {
    jl_Object.call(this);
}
function otjb_WindowEventTarget() {
    jl_Object.call(this);
}
function otjb_WindowEventTarget_listenBeforeOnload$static($this, $listener) {
    var var$3;
    var$3 = $rt_s(43);
    $this.addEventListener($rt_ustr(var$3), otji_JS_function($listener, "handleEvent"));
}
function otjb_StorageProvider() {
    jl_Object.call(this);
}
function otjc_JSArrayReader() {
    jl_Object.call(this);
}
function otjb_Window() {
    jl_Object.call(this);
}
function otjb_Window_removeEventListener$exported$0(var$0, var$1, var$2) {
    var$0.$removeEventListener($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"));
}
function otjb_Window_removeEventListener$exported$1(var$0, var$1, var$2, var$3) {
    var$0.$removeEventListener1($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"), var$3 ? 1 : 0);
}
function otjb_Window_dispatchEvent$exported$2(var$0, var$1) {
    return !!var$0.$dispatchEvent(var$1);
}
function otjb_Window_addEventListener$exported$3(var$0, var$1, var$2) {
    var$0.$addEventListener($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"));
}
function otjb_Window_get$exported$4(var$0, var$1) {
    return var$0.$get1(var$1);
}
function otjb_Window_getLength$exported$5(var$0) {
    return var$0.$getLength();
}
function otjb_Window_addEventListener$exported$6(var$0, var$1, var$2, var$3) {
    var$0.$addEventListener1($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"), var$3 ? 1 : 0);
}
function otjuc_CodeMirror() {
    jl_Object.call(this);
}
function $$LAMBDA1$$() {
    jl_Object.call(this);
}
function $$LAMBDA1$$__init_() {
    var $r = new $$LAMBDA1$$();
    $$LAMBDA1$$__init_1($r);
    return $r;
}
function $$LAMBDA1$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA1$$_handleEvent(var$0, var$1) {
    otju_Client_lambda$initEditor$2(var$1);
}
function $$LAMBDA1$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA1$$_handleEvent(var$0, var$1);
}
function $$LAMBDA2$$() {
    jl_Object.call(this);
}
function $$LAMBDA2$$__init_() {
    var $r = new $$LAMBDA2$$();
    $$LAMBDA2$$__init_1($r);
    return $r;
}
function $$LAMBDA2$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA2$$_handleEvent(var$0, var$1) {
    otju_Client_lambda$initEditor$3(var$1);
}
function $$LAMBDA2$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA2$$_handleEvent(var$0, var$1);
}
function $$LAMBDA3$$() {
    jl_Object.call(this);
}
function $$LAMBDA3$$__init_() {
    var $r = new $$LAMBDA3$$();
    $$LAMBDA3$$__init_1($r);
    return $r;
}
function $$LAMBDA3$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA3$$_handleEvent(var$0, var$1) {
    $$LAMBDA3$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA3$$_handleEvent1(var$0, var$1) {
    otju_Client_lambda$initExamples$4(var$1);
}
function $$LAMBDA3$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA3$$_handleEvent(var$0, var$1);
}
function $$LAMBDA4$$() {
    jl_Object.call(this);
}
function $$LAMBDA4$$__init_() {
    var $r = new $$LAMBDA4$$();
    $$LAMBDA4$$__init_1($r);
    return $r;
}
function $$LAMBDA4$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA4$$_handleEvent(var$0, var$1) {
    $$LAMBDA4$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA4$$_handleEvent1(var$0, var$1) {
    otju_Client_lambda$initExamples$5(var$1);
}
function $$LAMBDA4$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA4$$_handleEvent(var$0, var$1);
}
function otja_XMLHttpRequest() {
    jl_Object.call(this);
}
function otja_XMLHttpRequest_onComplete$static($this, $runnable) {
    $runnable = otji_JS_function($$LAMBDA7$$__init_($this, $runnable), "stateChanged");
    $this.onreadystatechange = $runnable;
}
function otja_XMLHttpRequest_lambda$onComplete$0$static($this, $runnable) {
    if ($this.readyState == 4) {
        $runnable.$run();
    }
}
function jl_AbstractStringBuilder() {
    var a = this; jl_Object.call(a);
    a.$buffer = null;
    a.$length1 = 0;
}
var jl_AbstractStringBuilder_powersOfTen = null;
var jl_AbstractStringBuilder_doublePowersOfTen = null;
var jl_AbstractStringBuilder_negPowersOfTen = null;
var jl_AbstractStringBuilder_negDoublePowersOfTen = null;
var jl_AbstractStringBuilder_intPowersOfTen = null;
var jl_AbstractStringBuilder_longPowersOfTen = null;
var jl_AbstractStringBuilder_longLogPowersOfTen = null;
function jl_AbstractStringBuilder_$callClinit() {
    jl_AbstractStringBuilder_$callClinit = function(){};
    jl_AbstractStringBuilder__clinit_();
}
function jl_AbstractStringBuilder__init_() {
    var $r = new jl_AbstractStringBuilder();
    jl_AbstractStringBuilder__init_1($r);
    return $r;
}
function jl_AbstractStringBuilder__init_2(var_1) {
    var $r = new jl_AbstractStringBuilder();
    jl_AbstractStringBuilder__init_3($r, var_1);
    return $r;
}
function jl_AbstractStringBuilder__init_4(var_1) {
    var $r = new jl_AbstractStringBuilder();
    jl_AbstractStringBuilder__init_5($r, var_1);
    return $r;
}
function jl_AbstractStringBuilder__init_6(var_1) {
    var $r = new jl_AbstractStringBuilder();
    jl_AbstractStringBuilder__init_7($r, var_1);
    return $r;
}
function jl_AbstractStringBuilder__init_1($this) {
    jl_AbstractStringBuilder_$callClinit();
    jl_AbstractStringBuilder__init_3($this, 16);
}
function jl_AbstractStringBuilder__init_3($this, $capacity) {
    jl_AbstractStringBuilder_$callClinit();
    jl_Object__init_1($this);
    $this.$buffer = $rt_createCharArray($capacity);
}
function jl_AbstractStringBuilder__init_5($this, $value) {
    jl_AbstractStringBuilder_$callClinit();
    jl_AbstractStringBuilder__init_7($this, $value);
}
function jl_AbstractStringBuilder__init_7($this, $value) {
    var $i;
    jl_AbstractStringBuilder_$callClinit();
    jl_Object__init_1($this);
    $this.$buffer = $rt_createCharArray(jl_String_length($value));
    $i = 0;
    while ($i < $this.$buffer.data.length) {
        $this.$buffer.data[$i] = jl_String_charAt($value, $i);
        $i = $i + 1 | 0;
    }
    $this.$length1 = jl_String_length($value);
}
function jl_AbstractStringBuilder_append($this, $string) {
    return jl_StringBuilder_insert($this, $this.$length1, $string);
}
function jl_AbstractStringBuilder_insert($this, $index, $string) {
    var $i, var$4, var$5;
    if ($index >= 0 && $index <= $this.$length1) {
        if ($string === null) {
            $string = jl_String_wrap($rt_s(44));
        } else if (jl_String_isEmpty($string) != 0) {
            return $this;
        }
        jl_StringBuilder_ensureCapacity($this, $this.$length1 + jl_String_length($string) | 0);
        $i = $this.$length1 - 1 | 0;
        while ($i >= $index) {
            $this.$buffer.data[$i + jl_String_length($string) | 0] = $this.$buffer.data[$i];
            $i = $i +  -1 | 0;
        }
        $this.$length1 = $this.$length1 + jl_String_length($string) | 0;
        $i = 0;
        while ($i < jl_String_length($string)) {
            var$4 = $this.$buffer.data;
            var$5 = $index + 1 | 0;
            var$4[$index] = jl_String_charAt($string, $i);
            $i = $i + 1 | 0;
            $index = var$5;
        }
        return $this;
    }
    $rt_throw(jl_StringIndexOutOfBoundsException__init_());
}
function jl_AbstractStringBuilder_append1($this, $value) {
    return jl_AbstractStringBuilder_append2($this, $value, 10);
}
function jl_AbstractStringBuilder_append2($this, $value, $radix) {
    return jl_AbstractStringBuilder_insert1($this, $this.$length1, $value, $radix);
}
function jl_AbstractStringBuilder_insert1($this, $target, $value, $radix) {
    var $positive, var$5, var$6, $pos, $sz, $posLimit, var$10;
    $positive = 1;
    if ($value < 0) {
        $positive = 0;
        $value =  -$value;
    }
    if ($value < $radix) {
        if ($positive != 0) {
            jl_AbstractStringBuilder_insertSpace($this, $target, $target + 1 | 0);
        } else {
            jl_AbstractStringBuilder_insertSpace($this, $target, $target + 2 | 0);
            var$5 = $this.$buffer.data;
            var$6 = $target + 1 | 0;
            var$5[$target] = 45;
            $target = var$6;
        }
        $this.$buffer.data[$target] = jl_Character_forDigit($value, $radix);
    } else {
        $pos = 1;
        $sz = 1;
        $posLimit = 2147483647 / $radix | 0;
        a: {
            while (true) {
                var$10 = $pos * $radix | 0;
                if (var$10 > $value) {
                    var$10 = $pos;
                    break a;
                }
                $sz = $sz + 1 | 0;
                if (var$10 > $posLimit) {
                    break;
                }
                $pos = var$10;
            }
        }
        if ($positive == 0) {
            $sz = $sz + 1 | 0;
        }
        jl_AbstractStringBuilder_insertSpace($this, $target, $target + $sz | 0);
        if ($positive != 0) {
            $positive = $target;
        } else {
            var$5 = $this.$buffer.data;
            $positive = $target + 1 | 0;
            var$5[$target] = 45;
        }
        while (var$10 > 0) {
            var$5 = $this.$buffer.data;
            $target = $positive + 1 | 0;
            var$5[$positive] = jl_Character_forDigit($value / var$10 | 0, $radix);
            $value = $value % var$10 | 0;
            var$10 = var$10 / $radix | 0;
            $positive = $target;
        }
    }
    return $this;
}
function jl_AbstractStringBuilder_append3($this, $c) {
    return jl_StringBuilder_insert1($this, $this.$length1, $c);
}
function jl_AbstractStringBuilder_insert2($this, $index, $c) {
    jl_AbstractStringBuilder_insertSpace($this, $index, $index + 1 | 0);
    $this.$buffer.data[$index] = $c;
    return $this;
}
function jl_AbstractStringBuilder_ensureCapacity($this, $capacity) {
    var $newLength, var$3;
    if ($this.$buffer.data.length >= $capacity) {
        return;
    }
    if ($this.$buffer.data.length >= 1073741823) {
        $newLength = 2147483647;
    } else {
        $newLength = $this.$buffer.data.length * 2 | 0;
        var$3 = 5;
        $newLength = jl_Math_max($capacity, jl_Math_max($newLength, var$3));
    }
    $this.$buffer = ju_Arrays_copyOf($this.$buffer, $newLength);
}
function jl_AbstractStringBuilder_toString($this) {
    return jl_String__init_2($this.$buffer, 0, $this.$length1);
}
function jl_AbstractStringBuilder_insertSpace($this, $start, $end) {
    var $sz, $i;
    $sz = $this.$length1 - $start | 0;
    jl_StringBuilder_ensureCapacity($this, ($this.$length1 + $end | 0) - $start | 0);
    $i = $sz - 1 | 0;
    while ($i >= 0) {
        $this.$buffer.data[$end + $i | 0] = $this.$buffer.data[$start + $i | 0];
        $i = $i +  -1 | 0;
    }
    $this.$length1 = $this.$length1 + ($end - $start | 0) | 0;
}
function jl_AbstractStringBuilder__clinit_() {
    var var$1, var$2, var$3, var$4, var$5, var$6, var$7, var$8;
    var$1 = $rt_createFloatArray(6);
    var$2 = var$1.data;
    var$2[0] = 10.0;
    var$2[1] = 100.0;
    var$2[2] = 10000.0;
    var$2[3] = 1.0E8;
    var$2[4] = 1.00000003E16;
    var$2[5] = 1.0E32;
    jl_AbstractStringBuilder_powersOfTen = var$1;
    var$3 = $rt_createDoubleArray(9);
    var$4 = var$3.data;
    var$4[0] = 10.0;
    var$4[1] = 100.0;
    var$4[2] = 10000.0;
    var$4[3] = 1.0E8;
    var$4[4] = 1.0E16;
    var$4[5] = 1.0E32;
    var$4[6] = 1.0E64;
    var$4[7] = 1.0E128;
    var$4[8] = 1.0E256;
    jl_AbstractStringBuilder_doublePowersOfTen = var$3;
    var$1 = $rt_createFloatArray(6);
    var$2 = var$1.data;
    var$2[0] = 0.1;
    var$2[1] = 0.01;
    var$2[2] = 1.0E-4;
    var$2[3] = 1.0E-8;
    var$2[4] = 1.0E-16;
    var$2[5] = 1.0E-32;
    jl_AbstractStringBuilder_negPowersOfTen = var$1;
    var$3 = $rt_createDoubleArray(9);
    var$4 = var$3.data;
    var$4[0] = 0.1;
    var$4[1] = 0.01;
    var$4[2] = 1.0E-4;
    var$4[3] = 1.0E-8;
    var$4[4] = 1.0E-16;
    var$4[5] = 1.0E-32;
    var$4[6] = 1.0E-64;
    var$4[7] = 1.0E-128;
    var$4[8] = 1.0E-256;
    jl_AbstractStringBuilder_negDoublePowersOfTen = var$3;
    var$5 = $rt_createIntArray(10);
    var$6 = var$5.data;
    var$6[0] = 1;
    var$6[1] = 10;
    var$6[2] = 100;
    var$6[3] = 1000;
    var$6[4] = 10000;
    var$6[5] = 100000;
    var$6[6] = 1000000;
    var$6[7] = 10000000;
    var$6[8] = 100000000;
    var$6[9] = 1000000000;
    jl_AbstractStringBuilder_intPowersOfTen = var$5;
    var$7 = $rt_createLongArray(19);
    var$8 = var$7.data;
    var$8[0] = Long_fromInt(1);
    var$8[1] = Long_fromInt(10);
    var$8[2] = Long_fromInt(100);
    var$8[3] = Long_fromInt(1000);
    var$8[4] = Long_fromInt(10000);
    var$8[5] = Long_fromInt(100000);
    var$8[6] = Long_fromInt(1000000);
    var$8[7] = Long_fromInt(10000000);
    var$8[8] = Long_fromInt(100000000);
    var$8[9] = Long_fromInt(1000000000);
    var$8[10] = new Long(1410065408, 2);
    var$8[11] = new Long(1215752192, 23);
    var$8[12] = new Long(3567587328, 232);
    var$8[13] = new Long(1316134912, 2328);
    var$8[14] = new Long(276447232, 23283);
    var$8[15] = new Long(2764472320, 232830);
    var$8[16] = new Long(1874919424, 2328306);
    var$8[17] = new Long(1569325056, 23283064);
    var$8[18] = new Long(2808348672, 232830643);
    jl_AbstractStringBuilder_longPowersOfTen = var$7;
    var$7 = $rt_createLongArray(6);
    var$8 = var$7.data;
    var$8[0] = Long_fromInt(1);
    var$8[1] = Long_fromInt(10);
    var$8[2] = Long_fromInt(100);
    var$8[3] = Long_fromInt(10000);
    var$8[4] = Long_fromInt(100000000);
    var$8[5] = new Long(1874919424, 2328306);
    jl_AbstractStringBuilder_longLogPowersOfTen = var$7;
}
function jl_Appendable() {
    jl_Object.call(this);
}
function jl_StringBuilder() {
    jl_AbstractStringBuilder.call(this);
}
function jl_StringBuilder__init_() {
    var $r = new jl_StringBuilder();
    jl_StringBuilder__init_2($r);
    return $r;
}
function jl_StringBuilder__init_1(var_1) {
    var $r = new jl_StringBuilder();
    jl_StringBuilder__init_3($r, var_1);
    return $r;
}
function jl_StringBuilder__init_2($this) {
    jl_AbstractStringBuilder__init_1($this);
}
function jl_StringBuilder__init_3($this, $value) {
    jl_AbstractStringBuilder__init_5($this, $value);
}
function jl_StringBuilder_append($this, $string) {
    jl_AbstractStringBuilder_append($this, $string);
    return $this;
}
function jl_StringBuilder_append1($this, $value) {
    jl_AbstractStringBuilder_append1($this, $value);
    return $this;
}
function jl_StringBuilder_append2($this, $c) {
    jl_AbstractStringBuilder_append3($this, $c);
    return $this;
}
function jl_StringBuilder_insert2($this, $index, $c) {
    jl_AbstractStringBuilder_insert2($this, $index, $c);
    return $this;
}
function jl_StringBuilder_insert3($this, $index, $string) {
    jl_AbstractStringBuilder_insert($this, $index, $string);
    return $this;
}
function jl_StringBuilder_toString($this) {
    return jl_AbstractStringBuilder_toString($this);
}
function jl_StringBuilder_ensureCapacity($this, var$1) {
    jl_AbstractStringBuilder_ensureCapacity($this, var$1);
}
function jl_StringBuilder_insert1($this, var$1, var$2) {
    return jl_StringBuilder_insert2($this, var$1, var$2);
}
function jl_StringBuilder_insert($this, var$1, var$2) {
    return jl_StringBuilder_insert3($this, var$1, var$2);
}
function $$LAMBDA5$$() {
    jl_Object.call(this);
    this.$_0 = null;
}
function $$LAMBDA5$$__init_(var_1) {
    var $r = new $$LAMBDA5$$();
    $$LAMBDA5$$__init_1($r, var_1);
    return $r;
}
function $$LAMBDA5$$__init_1(var$0, var$1) {
    jl_Object__init_1(var$0);
    var$0.$_0 = var$1;
}
function $$LAMBDA5$$_run(var$0) {
    otju_Client_lambda$initExamples$6(var$0.$_0);
}
function $$LAMBDA6$$() {
    jl_Object.call(this);
}
function $$LAMBDA6$$__init_() {
    var $r = new $$LAMBDA6$$();
    $$LAMBDA6$$__init_1($r);
    return $r;
}
function $$LAMBDA6$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA6$$_handleEvent(var$0, var$1) {
    $$LAMBDA6$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA6$$_handleEvent1(var$0, var$1) {
    otju_Client_lambda$initStdout$9(var$1);
}
function $$LAMBDA6$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA6$$_handleEvent(var$0, var$1);
}
function otjw_AbstractWorker() {
    jl_Object.call(this);
}
function otjw_Worker() {
    jl_Object.call(this);
}
function otjw_Worker_removeEventListener$exported$0(var$0, var$1, var$2) {
    var$0.$removeEventListener($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"));
}
function otjw_Worker_removeEventListener$exported$1(var$0, var$1, var$2, var$3) {
    var$0.$removeEventListener1($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"), var$3 ? 1 : 0);
}
function otjw_Worker_dispatchEvent$exported$2(var$0, var$1) {
    return !!var$0.$dispatchEvent(var$1);
}
function otjw_Worker_addEventListener$exported$3(var$0, var$1, var$2) {
    var$0.$addEventListener($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"));
}
function otjw_Worker_addEventListener$exported$4(var$0, var$1, var$2, var$3) {
    var$0.$addEventListener1($rt_str(var$1), otji_JS_functionAsObject(var$2, "handleEvent"), var$3 ? 1 : 0);
}
function otjw_Worker_onError$exported$5(var$0, var$1) {
    var$0.$onError(otji_JS_functionAsObject(var$1, "handleEvent"));
}
function ju_Map() {
    jl_Object.call(this);
}
function ju_AbstractMap() {
    jl_Object.call(this);
}
function ju_AbstractMap__init_() {
    var $r = new ju_AbstractMap();
    ju_AbstractMap__init_1($r);
    return $r;
}
function ju_AbstractMap__init_1($this) {
    jl_Object__init_1($this);
}
function ju_HashMap() {
    var a = this; ju_AbstractMap.call(a);
    a.$elementCount = 0;
    a.$elementData = null;
    a.$modCount = 0;
    a.$loadFactor = 0.0;
    a.$threshold = 0;
}
function ju_HashMap__init_() {
    var $r = new ju_HashMap();
    ju_HashMap__init_1($r);
    return $r;
}
function ju_HashMap__init_2(var_1) {
    var $r = new ju_HashMap();
    ju_HashMap__init_3($r, var_1);
    return $r;
}
function ju_HashMap__init_4(var_1, var_2) {
    var $r = new ju_HashMap();
    ju_HashMap__init_5($r, var_1, var_2);
    return $r;
}
function ju_HashMap_newElementArray($this, $s) {
    return $rt_createArray(ju_HashMap$HashEntry, $s);
}
function ju_HashMap__init_1($this) {
    ju_HashMap__init_3($this, 16);
}
function ju_HashMap__init_3($this, $capacity) {
    ju_HashMap__init_5($this, $capacity, 0.75);
}
function ju_HashMap_calculateCapacity($x) {
    var var$2;
    if ($x >= 1073741824) {
        return 1073741824;
    }
    if ($x == 0) {
        return 16;
    }
    var$2 = $x - 1 | 0;
    $x = var$2 | var$2 >> 1;
    $x = $x | $x >> 2;
    $x = $x | $x >> 4;
    $x = $x | $x >> 8;
    $x = $x | $x >> 16;
    return $x + 1 | 0;
}
function ju_HashMap__init_5($this, $capacity, $loadFactor) {
    ju_AbstractMap__init_1($this);
    if ($capacity >= 0 && $loadFactor > 0.0) {
        $capacity = ju_HashMap_calculateCapacity($capacity);
        $this.$elementCount = 0;
        $this.$elementData = $this.$newElementArray($capacity);
        $this.$loadFactor = $loadFactor;
        ju_HashMap_computeThreshold($this);
        return;
    }
    $rt_throw(jl_IllegalArgumentException__init_());
}
function ju_HashMap_computeThreshold($this) {
    $this.$threshold = $this.$elementData.data.length * $this.$loadFactor | 0;
}
function ju_HashMap_entrySet($this) {
    return ju_HashMap$HashMapEntrySet__init_($this);
}
function ju_HashMap_get($this, $key) {
    var $m;
    $m = ju_HashMap_getEntry($this, $key);
    if ($m === null) {
        return null;
    }
    return $m.$value;
}
function ju_HashMap_getEntry($this, $key) {
    var $m, $hash, $index;
    if ($key === null) {
        $m = ju_HashMap_findNullKeyEntry($this);
    } else {
        $hash = ju_HashMap_computeHashCode($key);
        $index = $hash & ($this.$elementData.data.length - 1 | 0);
        $m = ju_HashMap_findNonNullKeyEntry($this, $key, $index, $hash);
    }
    return $m;
}
function ju_HashMap_findNonNullKeyEntry($this, $key, $index, $keyHash) {
    var $m, var$5;
    $m = $this.$elementData.data[$index];
    while ($m !== null) {
        if ($m.$origKeyHash == $keyHash) {
            var$5 = $m.$key;
            if (ju_HashMap_areEqualKeys($key, var$5) != 0) {
                break;
            }
        }
        $m = $m.$next1;
    }
    return $m;
}
function ju_HashMap_findNullKeyEntry($this) {
    var $m;
    $m = $this.$elementData.data[0];
    while ($m !== null) {
        if ($m.$key === null) {
            break;
        }
        $m = $m.$next1;
    }
    return $m;
}
function ju_HashMap_put($this, $key, $value) {
    return ju_HashMap_putImpl($this, $key, $value);
}
function ju_HashMap_putImpl($this, $key, $value) {
    var $entry, $hash, $index, $result;
    if ($key === null) {
        $entry = ju_HashMap_findNullKeyEntry($this);
        if ($entry === null) {
            $this.$modCount = $this.$modCount + 1 | 0;
            $entry = ju_HashMap_createHashedEntry($this, null, 0, 0);
            $hash = $this.$elementCount + 1 | 0;
            $this.$elementCount = $hash;
            if ($hash > $this.$threshold) {
                ju_HashMap_rehash($this);
            }
        }
    } else {
        $hash = ju_HashMap_computeHashCode($key);
        $index = $hash & ($this.$elementData.data.length - 1 | 0);
        $entry = ju_HashMap_findNonNullKeyEntry($this, $key, $index, $hash);
        if ($entry === null) {
            $this.$modCount = $this.$modCount + 1 | 0;
            $entry = ju_HashMap_createHashedEntry($this, $key, $index, $hash);
            $hash = $this.$elementCount + 1 | 0;
            $this.$elementCount = $hash;
            if ($hash > $this.$threshold) {
                ju_HashMap_rehash($this);
            }
        }
    }
    $result = $entry.$value;
    $entry.$value = $value;
    return $result;
}
function ju_HashMap_createHashedEntry($this, $key, $index, $hash) {
    var $entry;
    $entry = ju_HashMap$HashEntry__init_($key, $hash);
    $entry.$next1 = $this.$elementData.data[$index];
    $this.$elementData.data[$index] = $entry;
    return $entry;
}
function ju_HashMap_rehash1($this, $capacity) {
    var $length, $newData, $i, $entry, var$6, $index, $next;
    $length = ju_HashMap_calculateCapacity($capacity == 0 ? 1 : $capacity << 1);
    $newData = $this.$newElementArray($length);
    $i = 0;
    while ($i < $this.$elementData.data.length) {
        $entry = $this.$elementData.data[$i];
        $this.$elementData.data[$i] = null;
        while ($entry !== null) {
            var$6 = $newData.data;
            $index = $entry.$origKeyHash & ($length - 1 | 0);
            $next = $entry.$next1;
            $entry.$next1 = var$6[$index];
            var$6[$index] = $entry;
            $entry = $next;
        }
        $i = $i + 1 | 0;
    }
    $this.$elementData = $newData;
    ju_HashMap_computeThreshold($this);
}
function ju_HashMap_rehash($this) {
    ju_HashMap_rehash1($this, $this.$elementData.data.length);
}
function ju_HashMap_removeEntry($this, $key) {
    var $index, $last, $entry, $hash, var$6, var$7;
    a: {
        $index = 0;
        $last = null;
        if ($key === null) {
            $entry = $this.$elementData.data[0];
            while ($entry !== null) {
                if ($entry.$key === null) {
                    break a;
                }
                $key = $entry.$next1;
                $last = $entry;
                $entry = $key;
            }
        } else {
            $hash = ju_HashMap_computeHashCode($key);
            $index = $hash & ($this.$elementData.data.length - 1 | 0);
            $entry = $this.$elementData.data[$index];
            while ($entry !== null) {
                if ($entry.$origKeyHash == $hash) {
                    if (ju_HashMap_areEqualKeys($key, $entry.$key) != 0) {
                        break;
                    }
                }
                var$6 = $entry.$next1;
                $last = $entry;
                $entry = var$6;
            }
        }
    }
    if ($entry === null) {
        return null;
    }
    if ($last !== null) {
        $last.$next1 = $entry.$next1;
    } else {
        var$7 = $this.$elementData.data;
        var$7[$index] = $entry.$next1;
    }
    $this.$modCount = $this.$modCount + 1 | 0;
    $this.$elementCount = $this.$elementCount - 1 | 0;
    return $entry;
}
function ju_HashMap_computeHashCode($key) {
    return jl_String_hashCode($key);
}
function ju_HashMap_areEqualKeys($key1, $key2) {
    return $key1 !== $key2 && jl_String_equals($key1, $key2) == 0 ? 0 : 1;
}
function otjc_JSArray() {
    jl_Object.call(this);
}
function otjc_JSArray_get$exported$0(var$0, var$1) {
    return var$0.$get1(var$1);
}
function otjc_JSArray_getLength$exported$1(var$0) {
    return var$0.$getLength();
}
function otjc_JSString() {
    jl_Object.call(this);
}
function otjc_JSString_stringValue$static($this) {
    return $rt_str($this);
}
function otja_ReadyStateChangeHandler() {
    jl_Object.call(this);
}
function $$LAMBDA7$$() {
    var a = this; jl_Object.call(a);
    a.$_01 = null;
    a.$_1 = null;
}
function $$LAMBDA7$$__init_(var_1, var_2) {
    var $r = new $$LAMBDA7$$();
    $$LAMBDA7$$__init_1($r, var_1, var_2);
    return $r;
}
function $$LAMBDA7$$__init_1(var$0, var$1, var$2) {
    jl_Object__init_1(var$0);
    var$0.$_01 = var$1;
    var$0.$_1 = var$2;
}
function $$LAMBDA7$$_stateChanged(var$0) {
    otja_XMLHttpRequest_lambda$onComplete$0$static(var$0.$_01, var$0.$_1);
}
function $$LAMBDA7$$_stateChanged$exported$0(var$0) {
    $$LAMBDA7$$_stateChanged(var$0);
}
function otpa_AsyncCallback() {
    jl_Object.call(this);
}
function otpp_AsyncCallbackWrapper() {
    jl_Object.call(this);
    this.$realAsyncCallback = null;
}
function otpp_AsyncCallbackWrapper__init_(var_1) {
    var $r = new otpp_AsyncCallbackWrapper();
    otpp_AsyncCallbackWrapper__init_1($r, var_1);
    return $r;
}
function otpp_AsyncCallbackWrapper__init_1($this, $realAsyncCallback) {
    jl_Object__init_1($this);
    $this.$realAsyncCallback = $realAsyncCallback;
}
function otpp_AsyncCallbackWrapper_create($realAsyncCallback) {
    return otpp_AsyncCallbackWrapper__init_($realAsyncCallback);
}
function otpp_AsyncCallbackWrapper_complete($this, $result) {
    $this.$realAsyncCallback.$complete($result);
}
function otpp_AsyncCallbackWrapper_error($this, $e) {
    $this.$realAsyncCallback.$error($e);
}
function otju_Client$1ResponseWait() {
    var a = this; jl_Object.call(a);
    a.$listener = null;
    a.$val$request = null;
    a.$val$callback = null;
}
function otju_Client$1ResponseWait__init_(var_1, var_2) {
    var $r = new otju_Client$1ResponseWait();
    otju_Client$1ResponseWait__init_1($r, var_1, var_2);
    return $r;
}
function otju_Client$1ResponseWait__init_1($this, var$1, var$2) {
    $this.$val$request = var$1;
    $this.$val$callback = var$2;
    jl_Object__init_1($this);
}
function otju_Client$1ResponseWait_run($this) {
    var var$1, var$2, var$3;
    $this.$listener = $$LAMBDA9$$__init_($this, $this.$val$request, $this.$val$callback);
    var$1 = otju_Client_access$000();
    var$2 = $rt_s(13);
    var$3 = $this.$listener;
    var$1.addEventListener($rt_ustr(var$2), otji_JS_function(var$3, "handleEvent"));
}
function otju_Client$1ResponseWait_lambda$run$0($this, $request, $callback, $event) {
    var $message;
    if (otju_Client_access$100($event.data) == 0) {
        return;
    }
    $message = otj_JSObject_cast$static($event.data);
    if (jl_String_equals($rt_str($message.id), $rt_str($request.id)) != 0) {
        otju_Client_access$000().removeEventListener("message", otji_JS_function($this.$listener, "handleEvent"));
        otpp_AsyncCallbackWrapper_complete($callback, $message);
    }
}
function ju_Comparator() {
    jl_Object.call(this);
}
function $$LAMBDA8$$() {
    jl_Object.call(this);
}
function $$LAMBDA8$$__init_() {
    var $r = new $$LAMBDA8$$();
    $$LAMBDA8$$__init_1($r);
    return $r;
}
function $$LAMBDA8$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function jl_AutoCloseable() {
    jl_Object.call(this);
}
function ji_Closeable() {
    jl_Object.call(this);
}
function ji_Flushable() {
    jl_Object.call(this);
}
function ji_OutputStream() {
    jl_Object.call(this);
}
function ji_OutputStream__init_() {
    var $r = new ji_OutputStream();
    ji_OutputStream__init_1($r);
    return $r;
}
function ji_OutputStream__init_1($this) {
    jl_Object__init_1($this);
}
function ji_FilterOutputStream() {
    ji_OutputStream.call(this);
    this.$out = null;
}
function ji_FilterOutputStream__init_(var_1) {
    var $r = new ji_FilterOutputStream();
    ji_FilterOutputStream__init_1($r, var_1);
    return $r;
}
function ji_FilterOutputStream__init_1($this, $out) {
    ji_OutputStream__init_1($this);
    $this.$out = $out;
}
function ji_PrintStream() {
    var a = this; ji_FilterOutputStream.call(a);
    a.$autoFlush = 0;
    a.$sb = null;
    a.$buffer1 = null;
    a.$charset = null;
}
function ji_PrintStream__init_(var_1, var_2) {
    var $r = new ji_PrintStream();
    ji_PrintStream__init_1($r, var_1, var_2);
    return $r;
}
function ji_PrintStream__init_1($this, $out, $autoFlush) {
    ji_FilterOutputStream__init_1($this, $out);
    $this.$sb = jl_StringBuilder__init_();
    $this.$buffer1 = $rt_createCharArray(32);
    $this.$autoFlush = $autoFlush;
    $this.$charset = jnci_UTF8Charset__init_();
}
function jl_ConsoleOutputStreamStdout() {
    ji_OutputStream.call(this);
}
function jl_ConsoleOutputStreamStdout__init_() {
    var $r = new jl_ConsoleOutputStreamStdout();
    jl_ConsoleOutputStreamStdout__init_1($r);
    return $r;
}
function jl_ConsoleOutputStreamStdout__init_1($this) {
    ji_OutputStream__init_1($this);
}
function jl_ConsoleOutputStreamStderr() {
    ji_OutputStream.call(this);
}
function jl_ConsoleOutputStreamStderr__init_() {
    var $r = new jl_ConsoleOutputStreamStderr();
    jl_ConsoleOutputStreamStderr__init_1($r);
    return $r;
}
function jl_ConsoleOutputStreamStderr__init_1($this) {
    ji_OutputStream__init_1($this);
}
function ji_InputStream() {
    jl_Object.call(this);
}
function ji_InputStream__init_() {
    var $r = new ji_InputStream();
    ji_InputStream__init_1($r);
    return $r;
}
function ji_InputStream__init_1($this) {
    jl_Object__init_1($this);
}
function jl_ConsoleInputStream() {
    ji_InputStream.call(this);
}
function jl_ConsoleInputStream__init_() {
    var $r = new jl_ConsoleInputStream();
    jl_ConsoleInputStream__init_1($r);
    return $r;
}
function jl_ConsoleInputStream__init_1($this) {
    ji_InputStream__init_1($this);
}
function jnc_Charset() {
    var a = this; jl_Object.call(a);
    a.$canonicalName = null;
    a.$aliases = null;
}
var jnc_Charset_charsets = null;
function jnc_Charset_$callClinit() {
    jnc_Charset_$callClinit = function(){};
    jnc_Charset__clinit_();
}
function jnc_Charset__init_(var_1, var_2) {
    var $r = new jnc_Charset();
    jnc_Charset__init_1($r, var_1, var_2);
    return $r;
}
function jnc_Charset__init_1($this, $canonicalName, $aliases) {
    var var$3, var$4, var$5, $alias;
    jnc_Charset_$callClinit();
    var$3 = $aliases.data;
    jl_Object__init_1($this);
    jnc_Charset_checkCanonicalName($canonicalName);
    var$4 = var$3.length;
    var$5 = 0;
    while (var$5 < var$4) {
        $alias = var$3[var$5];
        jnc_Charset_checkCanonicalName($alias);
        var$5 = var$5 + 1 | 0;
    }
    $this.$canonicalName = $canonicalName;
    $this.$aliases = $aliases.$clone();
}
function jnc_Charset_checkCanonicalName($name) {
    var $i, $c;
    jnc_Charset_$callClinit();
    if (jl_String_isEmpty($name) != 0) {
        $rt_throw(jnc_IllegalCharsetNameException__init_($name));
    }
    if (jnc_Charset_isValidCharsetStart(jl_String_charAt($name, 0)) == 0) {
        $rt_throw(jnc_IllegalCharsetNameException__init_($name));
    }
    $i = 1;
    while ($i < jl_String_length($name)) {
        a: {
            $c = jl_String_charAt($name, $i);
            switch ($c) {
                case 43:
                case 45:
                case 46:
                case 58:
                case 95:
                    break;
                default:
                    if (jnc_Charset_isValidCharsetStart($c) != 0) {
                        break a;
                    } else {
                        $rt_throw(jnc_IllegalCharsetNameException__init_($name));
                    }
            }
        }
        $i = $i + 1 | 0;
    }
}
function jnc_Charset_isValidCharsetStart($c) {
    jnc_Charset_$callClinit();
    return !($c >= 48 && $c <= 57) && !($c >= 97 && $c <= 122) && $c < 65 && $c > 90 ? 0 : 1;
}
function jnc_Charset__clinit_() {
    jnc_Charset_charsets = ju_HashMap__init_();
    ju_HashMap_put(jnc_Charset_charsets, $rt_s(45), jnci_UTF8Charset__init_());
}
function jnci_UTF8Charset() {
    jnc_Charset.call(this);
}
function jnci_UTF8Charset__init_() {
    var $r = new jnci_UTF8Charset();
    jnci_UTF8Charset__init_1($r);
    return $r;
}
function jnci_UTF8Charset__init_1($this) {
    jnc_Charset__init_1($this, $rt_s(45), $rt_createArray(jl_String, 0));
}
function jl_IllegalArgumentException() {
    jl_RuntimeException.call(this);
}
function jl_IllegalArgumentException__init_() {
    var $r = new jl_IllegalArgumentException();
    jl_IllegalArgumentException__init_1($r);
    return $r;
}
function jl_IllegalArgumentException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function jnc_IllegalCharsetNameException() {
    jl_IllegalArgumentException.call(this);
    this.$charsetName = null;
}
function jnc_IllegalCharsetNameException__init_(var_1) {
    var $r = new jnc_IllegalCharsetNameException();
    jnc_IllegalCharsetNameException__init_1($r, var_1);
    return $r;
}
function jnc_IllegalCharsetNameException__init_1($this, $charsetName) {
    jl_IllegalArgumentException__init_1($this);
    $this.$charsetName = $charsetName;
}
function ju_Map$Entry() {
    jl_Object.call(this);
}
function ju_MapEntry() {
    var a = this; jl_Object.call(a);
    a.$key = null;
    a.$value = null;
}
function ju_MapEntry__init_(var_1, var_2) {
    var $r = new ju_MapEntry();
    ju_MapEntry__init_1($r, var_1, var_2);
    return $r;
}
function ju_MapEntry__init_1($this, $theKey, $theValue) {
    jl_Object__init_1($this);
    $this.$key = $theKey;
    $this.$value = $theValue;
}
function ju_MapEntry_getKey($this) {
    return $this.$key;
}
function ju_MapEntry_getValue($this) {
    return $this.$value;
}
function ju_HashMap$HashEntry() {
    var a = this; ju_MapEntry.call(a);
    a.$origKeyHash = 0;
    a.$next1 = null;
}
function ju_HashMap$HashEntry__init_(var_1, var_2) {
    var $r = new ju_HashMap$HashEntry();
    ju_HashMap$HashEntry__init_1($r, var_1, var_2);
    return $r;
}
function ju_HashMap$HashEntry__init_1($this, $theKey, $hash) {
    ju_MapEntry__init_1($this, $theKey, null);
    $this.$origKeyHash = $hash;
}
function jl_StringIndexOutOfBoundsException() {
    jl_IndexOutOfBoundsException.call(this);
}
function jl_StringIndexOutOfBoundsException__init_() {
    var $r = new jl_StringIndexOutOfBoundsException();
    jl_StringIndexOutOfBoundsException__init_1($r);
    return $r;
}
function jl_StringIndexOutOfBoundsException__init_1($this) {
    jl_IndexOutOfBoundsException__init_1($this);
}
function $$LAMBDA9$$() {
    var a = this; jl_Object.call(a);
    a.$_02 = null;
    a.$_11 = null;
    a.$_2 = null;
}
function $$LAMBDA9$$__init_(var_1, var_2, var_3) {
    var $r = new $$LAMBDA9$$();
    $$LAMBDA9$$__init_1($r, var_1, var_2, var_3);
    return $r;
}
function $$LAMBDA9$$__init_1(var$0, var$1, var$2, var$3) {
    jl_Object__init_1(var$0);
    var$0.$_02 = var$1;
    var$0.$_11 = var$2;
    var$0.$_2 = var$3;
}
function $$LAMBDA9$$_handleEvent(var$0, var$1) {
    $$LAMBDA9$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA9$$_handleEvent1(var$0, var$1) {
    otju_Client$1ResponseWait_lambda$run$0(var$0.$_02, var$0.$_11, var$0.$_2, var$1);
}
function $$LAMBDA9$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA9$$_handleEvent(var$0, var$1);
}
function $$LAMBDA10$$() {
    jl_Object.call(this);
}
function $$LAMBDA10$$__init_() {
    var $r = new $$LAMBDA10$$();
    $$LAMBDA10$$__init_1($r);
    return $r;
}
function $$LAMBDA10$$__init_1(var$0) {
    jl_Object__init_1(var$0);
}
function $$LAMBDA10$$_run(var$0) {
    var $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$0 = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        $ptr = 1;
    case 1:
        otju_Client_lambda$null$0();
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push(var$0, $ptr);
}
function otjj_JSON() {
    jl_Object.call(this);
}
function otjdx_Element() {
    jl_Object.call(this);
}
function otjdc_ElementCSSInlineStyle() {
    jl_Object.call(this);
}
function otjde_WheelEventTarget() {
    jl_Object.call(this);
}
function otjdh_HTMLElement() {
    jl_Object.call(this);
}
function otjdh_HTMLElement_withAttr$static($this, $name, $value) {
    $this.setAttribute($rt_ustr($name), $rt_ustr($value));
    return $this;
}
function otjdh_HTMLElement_clear$static($this) {
    var $node, $prev;
    $node = $this.lastChild;
    while ($node !== null) {
        $prev = $node.previousSibling;
        if ($node.nodeType != 2) {
            $this.removeChild($node);
        }
        $node = $prev;
    }
    return $this;
}
function otjdh_HTMLElement_withText$static($this, $content) {
    var var$3;
    var$3 = otjdh_HTMLElement_clear$static($this);
    $content = $this.ownerDocument.createTextNode($rt_ustr($content));
    var$3.appendChild($content);
    return $this;
}
function jl_Math() {
    jl_Object.call(this);
}
function jl_Math_min($a, $b) {
    if ($a < $b) {
        $b = $a;
    }
    return $b;
}
function jl_Math_max($a, $b) {
    if ($a > $b) {
        $b = $a;
    }
    return $b;
}
function otp_PlatformRunnable() {
    jl_Object.call(this);
}
function $$LAMBDA11$$() {
    jl_Object.call(this);
    this.$_03 = null;
}
function $$LAMBDA11$$__init_(var_1) {
    var $r = new $$LAMBDA11$$();
    $$LAMBDA11$$__init_1($r, var_1);
    return $r;
}
function $$LAMBDA11$$__init_1(var$0, var$1) {
    jl_Object__init_1(var$0);
    var$0.$_03 = var$1;
}
function $$LAMBDA11$$_run(var$0) {
    var var$1, $ptr, $tmp;
    $ptr = 0;
    if ($rt_resuming()) {
        var $thread = $rt_nativeThread();
        $ptr = $thread.pop();var$1 = $thread.pop();var$0 = $thread.pop();
    }
    main: while (true) { switch ($ptr) {
    case 0:
        var$1 = var$0.$_03;
        $ptr = 1;
    case 1:
        jl_Thread_lambda$start$0(var$1);
        if ($rt_suspending()) {
            break main;
        }
        return;
    default: $rt_invalidPointer();
    }}
    $rt_nativeThread().push(var$0, var$1, $ptr);
}
function otju_Client$ExampleCategory() {
    var a = this; jl_Object.call(a);
    a.$title = null;
    a.$items = null;
}
function otju_Client$ExampleCategory__init_() {
    var $r = new otju_Client$ExampleCategory();
    otju_Client$ExampleCategory__init_1($r);
    return $r;
}
function otju_Client$ExampleCategory__init_1($this) {
    jl_Object__init_1($this);
    $this.$items = ju_LinkedHashMap__init_();
}
function $$LAMBDA12$$() {
    var a = this; jl_Object.call(a);
    a.$_04 = null;
    a.$_12 = null;
}
function $$LAMBDA12$$__init_(var_1, var_2) {
    var $r = new $$LAMBDA12$$();
    $$LAMBDA12$$__init_1($r, var_1, var_2);
    return $r;
}
function $$LAMBDA12$$__init_1(var$0, var$1, var$2) {
    jl_Object__init_1(var$0);
    var$0.$_04 = var$1;
    var$0.$_12 = var$2;
}
function $$LAMBDA12$$_handleEvent(var$0, var$1) {
    $$LAMBDA12$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA12$$_handleEvent1(var$0, var$1) {
    otju_Client_lambda$renderExamples$7(var$0.$_04, var$0.$_12, var$1);
}
function $$LAMBDA12$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA12$$_handleEvent(var$0, var$1);
}
function ju_LinkedHashMap() {
    var a = this; ju_HashMap.call(a);
    a.$accessOrder = 0;
    a.$head = null;
    a.$tail = null;
}
function ju_LinkedHashMap__init_() {
    var $r = new ju_LinkedHashMap();
    ju_LinkedHashMap__init_1($r);
    return $r;
}
function ju_LinkedHashMap__init_1($this) {
    ju_HashMap__init_1($this);
    $this.$accessOrder = 0;
    $this.$head = null;
}
function ju_LinkedHashMap_newElementArray($this, $s) {
    return $rt_createArray(ju_LinkedHashMap$LinkedHashMapEntry, $s);
}
function ju_LinkedHashMap_createHashedEntry($this, $key, $index, $hash) {
    var $m;
    $m = ju_LinkedHashMap$LinkedHashMapEntry__init_($key, $hash);
    $m.$next1 = $this.$elementData.data[$index];
    $this.$elementData.data[$index] = $m;
    ju_LinkedHashMap_linkEntry($this, $m);
    return $m;
}
function ju_LinkedHashMap_put($this, $key, $value) {
    var $result;
    $result = ju_LinkedHashMap_putImpl($this, $key, $value);
    if (ju_LinkedHashMap_removeEldestEntry($this, $this.$head) != 0) {
        $key = $this.$head;
        ju_LinkedHashMap_remove($this, $key.$key);
    }
    return $result;
}
function ju_LinkedHashMap_putImpl($this, $key, $value) {
    var $m, $index, $hash, var$6, $result;
    if ($this.$elementCount == 0) {
        $this.$head = null;
        $this.$tail = null;
    }
    if ($key === null) {
        $m = ju_HashMap_findNullKeyEntry($this);
        if ($m !== null) {
            ju_LinkedHashMap_linkEntry($this, $m);
        } else {
            $this.$modCount = $this.$modCount + 1 | 0;
            $index = $this.$elementCount + 1 | 0;
            $this.$elementCount = $index;
            if ($index > $this.$threshold) {
                ju_HashMap_rehash($this);
            }
            $m = ju_LinkedHashMap_createHashedEntry($this, null, 0, 0);
        }
    } else {
        $hash = jl_String_hashCode($key);
        $index = ($hash & 2147483647) % $this.$elementData.data.length | 0;
        $m = ju_HashMap_findNonNullKeyEntry($this, $key, $index, $hash);
        if ($m !== null) {
            ju_LinkedHashMap_linkEntry($this, $m);
        } else {
            $this.$modCount = $this.$modCount + 1 | 0;
            var$6 = $this.$elementCount + 1 | 0;
            $this.$elementCount = var$6;
            if (var$6 > $this.$threshold) {
                ju_HashMap_rehash($this);
                $index = ($hash & 2147483647) % $this.$elementData.data.length | 0;
            }
            $m = ju_LinkedHashMap_createHashedEntry($this, $key, $index, $hash);
        }
    }
    $result = $m.$value;
    $m.$value = $value;
    return $result;
}
function ju_LinkedHashMap_linkEntry($this, $m) {
    var $p, $n;
    if ($this.$tail === $m) {
        return;
    }
    if ($this.$head === null) {
        $this.$head = $m;
        $this.$tail = $m;
        return;
    }
    $p = $m.$chainBackward;
    $n = $m.$chainForward;
    if ($p !== null) {
        if ($n === null) {
            return;
        }
        if ($this.$accessOrder != 0) {
            $p.$chainForward = $n;
            $n.$chainBackward = $p;
            $m.$chainForward = null;
            $m.$chainBackward = $this.$tail;
            $this.$tail.$chainForward = $m;
            $this.$tail = $m;
        }
        return;
    }
    if ($n === null) {
        $m.$chainBackward = $this.$tail;
        $m.$chainForward = null;
        $this.$tail.$chainForward = $m;
        $this.$tail = $m;
    } else if ($this.$accessOrder != 0) {
        $this.$head = $n;
        $n.$chainBackward = null;
        $m.$chainBackward = $this.$tail;
        $m.$chainForward = null;
        $this.$tail.$chainForward = $m;
        $this.$tail = $m;
    }
}
function ju_LinkedHashMap_entrySet($this) {
    return ju_LinkedHashMap$LinkedHashMapEntrySet__init_($this);
}
function ju_LinkedHashMap_remove($this, $key) {
    var $m, $p, $n;
    $m = ju_HashMap_removeEntry($this, $key);
    if ($m === null) {
        return null;
    }
    $p = $m.$chainBackward;
    $n = $m.$chainForward;
    if ($p === null) {
        $this.$head = $n;
    } else {
        $p.$chainForward = $n;
    }
    if ($n === null) {
        $this.$tail = $p;
    } else {
        $n.$chainBackward = $p;
    }
    return $m.$value;
}
function ju_LinkedHashMap_removeEldestEntry($this, $eldest) {
    return 0;
}
function ju_LinkedHashMap_access$000($x0) {
    return $x0.$head;
}
function jl_Iterable() {
    jl_Object.call(this);
}
function ju_Collection() {
    jl_Object.call(this);
}
function ju_AbstractCollection() {
    jl_Object.call(this);
}
function ju_AbstractCollection__init_() {
    var $r = new ju_AbstractCollection();
    ju_AbstractCollection__init_1($r);
    return $r;
}
function ju_AbstractCollection__init_1($this) {
    jl_Object__init_1($this);
}
function ju_Set() {
    jl_Object.call(this);
}
function ju_AbstractSet() {
    ju_AbstractCollection.call(this);
}
function ju_AbstractSet__init_() {
    var $r = new ju_AbstractSet();
    ju_AbstractSet__init_1($r);
    return $r;
}
function ju_AbstractSet__init_1($this) {
    ju_AbstractCollection__init_1($this);
}
function ju_HashMap$HashMapEntrySet() {
    ju_AbstractSet.call(this);
    this.$associatedMap = null;
}
function ju_HashMap$HashMapEntrySet__init_(var_1) {
    var $r = new ju_HashMap$HashMapEntrySet();
    ju_HashMap$HashMapEntrySet__init_1($r, var_1);
    return $r;
}
function ju_HashMap$HashMapEntrySet__init_1($this, $hm) {
    ju_AbstractSet__init_1($this);
    $this.$associatedMap = $hm;
}
function ju_HashMap$HashMapEntrySet_hashMap($this) {
    return $this.$associatedMap;
}
function ju_HashMap$HashMapEntrySet_iterator($this) {
    return ju_HashMap$EntryIterator__init_($this.$associatedMap);
}
function ju_LinkedHashMap$LinkedHashMapEntry() {
    var a = this; ju_HashMap$HashEntry.call(a);
    a.$chainForward = null;
    a.$chainBackward = null;
}
function ju_LinkedHashMap$LinkedHashMapEntry__init_(var_1, var_2) {
    var $r = new ju_LinkedHashMap$LinkedHashMapEntry();
    ju_LinkedHashMap$LinkedHashMapEntry__init_1($r, var_1, var_2);
    return $r;
}
function ju_LinkedHashMap$LinkedHashMapEntry__init_1($this, $theKey, $hash) {
    ju_HashMap$HashEntry__init_1($this, $theKey, $hash);
    $this.$chainForward = null;
    $this.$chainBackward = null;
}
function ju_LinkedHashMap$LinkedHashMapEntrySet() {
    ju_HashMap$HashMapEntrySet.call(this);
}
function ju_LinkedHashMap$LinkedHashMapEntrySet__init_(var_1) {
    var $r = new ju_LinkedHashMap$LinkedHashMapEntrySet();
    ju_LinkedHashMap$LinkedHashMapEntrySet__init_1($r, var_1);
    return $r;
}
function ju_LinkedHashMap$LinkedHashMapEntrySet__init_1($this, $lhm) {
    ju_HashMap$HashMapEntrySet__init_1($this, $lhm);
}
function ju_LinkedHashMap$LinkedHashMapEntrySet_iterator($this) {
    return ju_LinkedHashMap$EntryIterator__init_(ju_HashMap$HashMapEntrySet_hashMap($this));
}
function jl_Character() {
    jl_Object.call(this);
}
var jl_Character_TYPE = null;
var jl_Character_characterCache = null;
function jl_Character_$callClinit() {
    jl_Character_$callClinit = function(){};
    jl_Character__clinit_();
}
function jl_Character_forDigit($digit, $radix) {
    jl_Character_$callClinit();
    if ($radix >= 2 && $radix <= 36 && $digit < $radix) {
        return $digit < 10 ? (48 + $digit | 0) & 65535 : ((97 + $digit | 0) - 10 | 0) & 65535;
    }
    return 0;
}
function jl_Character__clinit_() {
    jl_Character_TYPE = $rt_cls($rt_charcls());
    jl_Character_characterCache = $rt_createArray(jl_Character, 128);
}
function $$LAMBDA13$$() {
    var a = this; jl_Object.call(a);
    a.$_05 = null;
    a.$_13 = null;
}
function $$LAMBDA13$$__init_(var_1, var_2) {
    var $r = new $$LAMBDA13$$();
    $$LAMBDA13$$__init_1($r, var_1, var_2);
    return $r;
}
function $$LAMBDA13$$__init_1(var$0, var$1, var$2) {
    jl_Object__init_1(var$0);
    var$0.$_05 = var$1;
    var$0.$_13 = var$2;
}
function $$LAMBDA13$$_run(var$0) {
    otju_Client_lambda$loadExample$8(var$0.$_05, var$0.$_13);
}
function ju_HashMap$AbstractMapIterator() {
    var a = this; jl_Object.call(a);
    a.$position = 0;
    a.$expectedModCount = 0;
    a.$futureEntry = null;
    a.$currentEntry = null;
    a.$prevEntry = null;
    a.$associatedMap1 = null;
}
function ju_HashMap$AbstractMapIterator__init_(var_1) {
    var $r = new ju_HashMap$AbstractMapIterator();
    ju_HashMap$AbstractMapIterator__init_1($r, var_1);
    return $r;
}
function ju_HashMap$AbstractMapIterator__init_1($this, $hm) {
    jl_Object__init_1($this);
    $this.$associatedMap1 = $hm;
    $this.$expectedModCount = $hm.$modCount;
    $this.$futureEntry = null;
}
function ju_HashMap$AbstractMapIterator_hasNext($this) {
    var var$1, var$2;
    if ($this.$futureEntry !== null) {
        return 1;
    }
    while (true) {
        var$1 = $this.$position;
        var$2 = $this.$associatedMap1;
        if (var$1 >= var$2.$elementData.data.length) {
            break;
        }
        if ($this.$associatedMap1.$elementData.data[$this.$position] !== null) {
            return 1;
        }
        $this.$position = $this.$position + 1 | 0;
    }
    return 0;
}
function ju_HashMap$AbstractMapIterator_checkConcurrentMod($this) {
    var var$1, var$2;
    var$1 = $this.$expectedModCount;
    var$2 = $this.$associatedMap1;
    if (var$1 == var$2.$modCount) {
        return;
    }
    $rt_throw(ju_ConcurrentModificationException__init_());
}
function ju_HashMap$AbstractMapIterator_makeNext($this) {
    var var$1, var$2, var$3;
    ju_HashMap$AbstractMapIterator_checkConcurrentMod($this);
    if (ju_HashMap$AbstractMapIterator_hasNext($this) == 0) {
        $rt_throw(ju_NoSuchElementException__init_());
    }
    if ($this.$futureEntry === null) {
        var$1 = $this.$associatedMap1;
        var$2 = var$1.$elementData.data;
        var$3 = $this.$position;
        $this.$position = var$3 + 1 | 0;
        $this.$currentEntry = var$2[var$3];
        var$1 = $this.$currentEntry;
        $this.$futureEntry = var$1.$next1;
        $this.$prevEntry = null;
    } else {
        if ($this.$currentEntry !== null) {
            $this.$prevEntry = $this.$currentEntry;
        }
        $this.$currentEntry = $this.$futureEntry;
        var$1 = $this.$futureEntry;
        $this.$futureEntry = var$1.$next1;
    }
}
function ju_Iterator() {
    jl_Object.call(this);
}
function ju_HashMap$EntryIterator() {
    ju_HashMap$AbstractMapIterator.call(this);
}
function ju_HashMap$EntryIterator__init_(var_1) {
    var $r = new ju_HashMap$EntryIterator();
    ju_HashMap$EntryIterator__init_1($r, var_1);
    return $r;
}
function ju_HashMap$EntryIterator__init_1($this, $map) {
    ju_HashMap$AbstractMapIterator__init_1($this, $map);
}
function ju_HashMap$EntryIterator_next1($this) {
    ju_HashMap$AbstractMapIterator_makeNext($this);
    return $this.$currentEntry;
}
function ju_HashMap$EntryIterator_next($this) {
    return ju_HashMap$EntryIterator_next1($this);
}
function ju_LinkedHashMap$AbstractMapIterator() {
    var a = this; jl_Object.call(a);
    a.$expectedModCount1 = 0;
    a.$futureEntry1 = null;
    a.$currentEntry1 = null;
    a.$associatedMap2 = null;
}
function ju_LinkedHashMap$AbstractMapIterator__init_(var_1) {
    var $r = new ju_LinkedHashMap$AbstractMapIterator();
    ju_LinkedHashMap$AbstractMapIterator__init_1($r, var_1);
    return $r;
}
function ju_LinkedHashMap$AbstractMapIterator__init_1($this, $map) {
    jl_Object__init_1($this);
    $this.$expectedModCount1 = $map.$modCount;
    $this.$futureEntry1 = ju_LinkedHashMap_access$000($map);
    $this.$associatedMap2 = $map;
}
function ju_LinkedHashMap$AbstractMapIterator_hasNext($this) {
    return $this.$futureEntry1 === null ? 0 : 1;
}
function ju_LinkedHashMap$AbstractMapIterator_checkConcurrentMod($this) {
    var var$1, var$2;
    var$1 = $this.$expectedModCount1;
    var$2 = $this.$associatedMap2;
    if (var$1 == var$2.$modCount) {
        return;
    }
    $rt_throw(ju_ConcurrentModificationException__init_());
}
function ju_LinkedHashMap$AbstractMapIterator_makeNext($this) {
    var var$1;
    ju_LinkedHashMap$AbstractMapIterator_checkConcurrentMod($this);
    if (ju_LinkedHashMap$AbstractMapIterator_hasNext($this) == 0) {
        $rt_throw(ju_NoSuchElementException__init_());
    }
    $this.$currentEntry1 = $this.$futureEntry1;
    var$1 = $this.$futureEntry1;
    $this.$futureEntry1 = var$1.$chainForward;
}
function ju_LinkedHashMap$EntryIterator() {
    ju_LinkedHashMap$AbstractMapIterator.call(this);
}
function ju_LinkedHashMap$EntryIterator__init_(var_1) {
    var $r = new ju_LinkedHashMap$EntryIterator();
    ju_LinkedHashMap$EntryIterator__init_1($r, var_1);
    return $r;
}
function ju_LinkedHashMap$EntryIterator__init_1($this, $map) {
    ju_LinkedHashMap$AbstractMapIterator__init_1($this, $map);
}
function ju_LinkedHashMap$EntryIterator_next1($this) {
    ju_LinkedHashMap$AbstractMapIterator_makeNext($this);
    return $this.$currentEntry1;
}
function ju_LinkedHashMap$EntryIterator_next($this) {
    return ju_LinkedHashMap$EntryIterator_next1($this);
}
function jl_IllegalMonitorStateException() {
    jl_RuntimeException.call(this);
}
function jl_IllegalMonitorStateException__init_() {
    var $r = new jl_IllegalMonitorStateException();
    jl_IllegalMonitorStateException__init_1($r);
    return $r;
}
function jl_IllegalMonitorStateException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function jl_Object$Monitor() {
    var a = this; jl_Object.call(a);
    a.$enteringThreads = null;
    a.$notifyListeners = null;
    a.$owner = null;
    a.$count = 0;
}
function jl_Object$Monitor__init_() {
    var $r = new jl_Object$Monitor();
    jl_Object$Monitor__init_1($r);
    return $r;
}
function jl_Object$Monitor__init_1($this) {
    jl_Object__init_1($this);
    $this.$owner = jl_Thread_currentThread();
    $this.$enteringThreads = [];
    $this.$notifyListeners = [];
}
function jl_IllegalStateException() {
    jl_Exception.call(this);
}
function jl_IllegalStateException__init_(var_1) {
    var $r = new jl_IllegalStateException();
    jl_IllegalStateException__init_1($r, var_1);
    return $r;
}
function jl_IllegalStateException__init_1($this, $message) {
    jl_Exception__init_3($this, $message);
}
function ju_Arrays() {
    jl_Object.call(this);
}
function ju_Arrays_copyOf($array, $length) {
    var $result, $sz, $i;
    $array = $array.data;
    $result = $rt_createCharArray($length);
    $sz = jl_Math_min($length, $array.length);
    $i = 0;
    while ($i < $sz) {
        $result.data[$i] = $array[$i];
        $i = $i + 1 | 0;
    }
    return $result;
}
function ju_Arrays_copyOf1($original, $newLength) {
    var var$3, $result, $sz, $i;
    var$3 = $original.data;
    $result = jlr_Array_newInstance(jl_Class_getComponentType(jl_Object_getClass($original)), $newLength);
    $sz = jl_Math_min($newLength, var$3.length);
    $i = 0;
    while ($i < $sz) {
        $result.data[$i] = var$3[$i];
        $i = $i + 1 | 0;
    }
    return $result;
}
function ju_Arrays_binarySearch($a, $key) {
    return ju_Arrays_binarySearch1($a, 0, $a.data.length, $key);
}
function ju_Arrays_binarySearch1($a, $fromIndex, $toIndex, $key) {
    var $u, var$6, $i, $e;
    if ($fromIndex > $toIndex) {
        $rt_throw(jl_IllegalArgumentException__init_());
    }
    $u = $toIndex - 1 | 0;
    while (true) {
        var$6 = $a.data;
        $i = ($fromIndex + $u | 0) / 2 | 0;
        $e = var$6[$i];
        if ($e == $key) {
            break;
        }
        if ($key >= $e) {
            $fromIndex = $i + 1 | 0;
            if ($fromIndex > $u) {
                return  -$i - 2 | 0;
            }
        } else {
            $u = $i - 1 | 0;
            if ($u < $fromIndex) {
                return  -$i - 1 | 0;
            }
        }
    }
    return $i;
}
function otp_PlatformQueue() {
    jl_Object.call(this);
}
function otp_PlatformQueue_wrap($obj) {
    return $obj;
}
function otp_PlatformQueue_isEmpty$static($this) {
    return $this.length != 0 ? 0 : 1;
}
function otp_PlatformQueue_add$static($this, $e) {
    $e = otp_PlatformQueue_wrap($e);
    $this.push($e);
}
function otp_PlatformQueue_remove$static($this) {
    return $this.shift();
}
function $$LAMBDA14$$() {
    jl_Object.call(this);
    this.$_06 = null;
}
function $$LAMBDA14$$__init_(var_1) {
    var $r = new $$LAMBDA14$$();
    $$LAMBDA14$$__init_1($r, var_1);
    return $r;
}
function $$LAMBDA14$$__init_1(var$0, var$1) {
    jl_Object__init_1(var$0);
    var$0.$_06 = var$1;
}
function $$LAMBDA14$$_run(var$0) {
    jl_Object_lambda$monitorExit$1(var$0.$_06);
}
function $$LAMBDA15$$() {
    var a = this; jl_Object.call(a);
    a.$_07 = null;
    a.$_14 = null;
    a.$_21 = 0;
    a.$_3 = null;
}
function $$LAMBDA15$$__init_(var_1, var_2, var_3, var_4) {
    var $r = new $$LAMBDA15$$();
    $$LAMBDA15$$__init_1($r, var_1, var_2, var_3, var_4);
    return $r;
}
function $$LAMBDA15$$__init_1(var$0, var$1, var$2, var$3, var$4) {
    jl_Object__init_1(var$0);
    var$0.$_07 = var$1;
    var$0.$_14 = var$2;
    var$0.$_21 = var$3;
    var$0.$_3 = var$4;
}
function $$LAMBDA15$$_run(var$0) {
    jl_Object_lambda$monitorEnterWait$0(var$0.$_07, var$0.$_14, var$0.$_21, var$0.$_3);
}
function otju_PositionIndexer() {
    jl_Object.call(this);
    this.$lines = null;
}
function otju_PositionIndexer__init_(var_1) {
    var $r = new otju_PositionIndexer();
    otju_PositionIndexer__init_1($r, var_1);
    return $r;
}
function otju_PositionIndexer__init_1($this, $text) {
    var $linesBuilder, $i, $i_0;
    jl_Object__init_1($this);
    $linesBuilder = ju_ArrayList__init_();
    ju_ArrayList_add($linesBuilder, jl_Integer_valueOf(0));
    $i = 0;
    while ($i < jl_String_length($text)) {
        if (jl_String_charAt($text, $i) == 10) {
            ju_ArrayList_add($linesBuilder, jl_Integer_valueOf($i + 1 | 0));
        }
        $i = $i + 1 | 0;
    }
    $this.$lines = $rt_createIntArray(ju_ArrayList_size($linesBuilder));
    $i_0 = 0;
    while ($i_0 < ju_ArrayList_size($linesBuilder)) {
        $this.$lines.data[$i_0] = jl_Integer_intValue(ju_ArrayList_get($linesBuilder, $i_0));
        $i_0 = $i_0 + 1 | 0;
    }
}
function otju_PositionIndexer_getPositionAt($this, $offset, $start) {
    var $line, $column;
    $line = ju_Arrays_binarySearch($this.$lines, $offset);
    if ($line < 0) {
        $line =  -$line - 2 | 0;
    }
    $column = $offset - $this.$lines.data[$line] | 0;
    if ($column > 0 && ($line + 1 | 0) < $this.$lines.data.length && ($offset + 2 | 0) >= $this.$lines.data[$line + 1 | 0]) {
        if ($start != 0) {
            $column = $column +  -1 | 0;
        } else {
            $column = 0;
            $line = $line + 1 | 0;
        }
    }
    return otju_Position__init_($line, $column);
}
function $$LAMBDA16$$() {
    jl_Object.call(this);
    this.$_08 = null;
}
function $$LAMBDA16$$__init_(var_1) {
    var $r = new $$LAMBDA16$$();
    $$LAMBDA16$$__init_1($r, var_1);
    return $r;
}
function $$LAMBDA16$$__init_1(var$0, var$1) {
    jl_Object__init_1(var$0);
    var$0.$_08 = var$1;
}
function $$LAMBDA16$$_handleEvent(var$0, var$1) {
    $$LAMBDA16$$_handleEvent1(var$0, var$1);
}
function $$LAMBDA16$$_handleEvent1(var$0, var$1) {
    otju_Client_lambda$executeCode$10(var$0.$_08, var$1);
}
function $$LAMBDA16$$_handleEvent$exported$0(var$0, var$1) {
    $$LAMBDA16$$_handleEvent(var$0, var$1);
}
function ju_List() {
    jl_Object.call(this);
}
function ju_AbstractList() {
    ju_AbstractCollection.call(this);
    this.$modCount1 = 0;
}
function ju_AbstractList__init_() {
    var $r = new ju_AbstractList();
    ju_AbstractList__init_1($r);
    return $r;
}
function ju_AbstractList__init_1($this) {
    ju_AbstractCollection__init_1($this);
}
function ju_ArrayList() {
    var a = this; ju_AbstractList.call(a);
    a.$array = null;
    a.$size1 = 0;
}
function ju_ArrayList__init_() {
    var $r = new ju_ArrayList();
    ju_ArrayList__init_1($r);
    return $r;
}
function ju_ArrayList__init_2(var_1) {
    var $r = new ju_ArrayList();
    ju_ArrayList__init_3($r, var_1);
    return $r;
}
function ju_ArrayList__init_1($this) {
    ju_ArrayList__init_3($this, 10);
}
function ju_ArrayList__init_3($this, $initialCapacity) {
    ju_AbstractList__init_1($this);
    $this.$array = $rt_createArray(jl_Object, $initialCapacity);
}
function ju_ArrayList_ensureCapacity($this, $minCapacity) {
    var $newLength, var$3;
    if ($this.$array.data.length < $minCapacity) {
        if ($this.$array.data.length >= 1073741823) {
            $newLength = 2147483647;
        } else {
            $newLength = $this.$array.data.length * 2 | 0;
            var$3 = 5;
            $newLength = jl_Math_max($minCapacity, jl_Math_max($newLength, var$3));
        }
        $this.$array = ju_Arrays_copyOf1($this.$array, $newLength);
    }
}
function ju_ArrayList_get($this, $index) {
    ju_ArrayList_checkIndex($this, $index);
    return $this.$array.data[$index];
}
function ju_ArrayList_size($this) {
    return $this.$size1;
}
function ju_ArrayList_add($this, $element) {
    var var$2, var$3;
    ju_ArrayList_ensureCapacity($this, $this.$size1 + 1 | 0);
    var$2 = $this.$array.data;
    var$3 = $this.$size1;
    $this.$size1 = var$3 + 1 | 0;
    var$2[var$3] = $element;
    $this.$modCount1 = $this.$modCount1 + 1 | 0;
    return 1;
}
function ju_ArrayList_checkIndex($this, $index) {
    if ($index >= 0 && $index < $this.$size1) {
        return;
    }
    $rt_throw(jl_IndexOutOfBoundsException__init_());
}
function jl_Number() {
    jl_Object.call(this);
}
function jl_Number__init_() {
    var $r = new jl_Number();
    jl_Number__init_1($r);
    return $r;
}
function jl_Number__init_1($this) {
    jl_Object__init_1($this);
}
function jl_Integer() {
    jl_Number.call(this);
    this.$value1 = 0;
}
var jl_Integer_TYPE = null;
var jl_Integer_integerCache = null;
function jl_Integer_$callClinit() {
    jl_Integer_$callClinit = function(){};
    jl_Integer__clinit_();
}
function jl_Integer__init_(var_1) {
    var $r = new jl_Integer();
    jl_Integer__init_1($r, var_1);
    return $r;
}
function jl_Integer__init_1($this, $value) {
    jl_Integer_$callClinit();
    jl_Number__init_1($this);
    $this.$value1 = $value;
}
function jl_Integer_valueOf($i) {
    jl_Integer_$callClinit();
    if ($i >=  -128 && $i <= 127) {
        jl_Integer_ensureIntegerCache();
        return jl_Integer_integerCache.data[$i + 128 | 0];
    }
    return jl_Integer__init_($i);
}
function jl_Integer_ensureIntegerCache() {
    var $j;
    jl_Integer_$callClinit();
    if (jl_Integer_integerCache === null) {
        jl_Integer_integerCache = $rt_createArray(jl_Integer, 256);
        $j = 0;
        while ($j < jl_Integer_integerCache.data.length) {
            jl_Integer_integerCache.data[$j] = jl_Integer__init_($j - 128 | 0);
            $j = $j + 1 | 0;
        }
    }
}
function jl_Integer_intValue($this) {
    return $this.$value1;
}
function jl_Integer__clinit_() {
    jl_Integer_TYPE = $rt_cls($rt_intcls());
}
function otju_Position() {
    var a = this; jl_Object.call(a);
    a.$line = 0;
    a.$column = 0;
}
function otju_Position__init_(var_1, var_2) {
    var $r = new otju_Position();
    otju_Position__init_1($r, var_1, var_2);
    return $r;
}
function otju_Position__init_1($this, $line, $column) {
    jl_Object__init_1($this);
    $this.$line = $line;
    $this.$column = $column;
}
function otjuc_TextLocation() {
    jl_Object.call(this);
}
function otjuc_TextLocation_create$js_body$_7(var$1, var$2) {
    return { line : var$1, ch : var$2 };
}
function ju_NoSuchElementException() {
    jl_RuntimeException.call(this);
}
function ju_NoSuchElementException__init_() {
    var $r = new ju_NoSuchElementException();
    ju_NoSuchElementException__init_1($r);
    return $r;
}
function ju_NoSuchElementException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function ju_ConcurrentModificationException() {
    jl_RuntimeException.call(this);
}
function ju_ConcurrentModificationException__init_() {
    var $r = new ju_ConcurrentModificationException();
    ju_ConcurrentModificationException__init_1($r);
    return $r;
}
function ju_ConcurrentModificationException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function jlr_Array() {
    jl_Object.call(this);
}
function jlr_Array_newInstance($componentType, $length) {
    if ($componentType === null) {
        $rt_throw(jl_NullPointerException__init_());
    }
    if ($componentType === jl_Object_wrap($rt_cls($rt_voidcls()))) {
        $rt_throw(jl_IllegalArgumentException__init_());
    }
    if ($length >= 0) {
        return jlr_Array_newInstanceImpl(jl_Class_getPlatformClass($componentType), $length);
    }
    $rt_throw(jl_NegativeArraySizeException__init_());
}
function jlr_Array_newInstanceImpl(var$1, var$2) {
    if (var$1.$meta.primitive) {
        if (var$1 == $rt_bytecls()) {
            return $rt_createByteArray(var$2);
        }
        if (var$1 == $rt_shortcls()) {
            return $rt_createShortArray(var$2);
        }
        if (var$1 == $rt_charcls()) {
            return $rt_createCharArray(var$2);
        }
        if (var$1 == $rt_intcls()) {
            return $rt_createIntArray(var$2);
        }
        if (var$1 == $rt_longcls()) {
            return $rt_createLongArray(var$2);
        }
        if (var$1 == $rt_floatcls()) {
            return $rt_createFloatArray(var$2);
        }
        if (var$1 == $rt_doublecls()) {
            return $rt_createDoubleArray(var$2);
        }
        if (var$1 == $rt_booleancls()) {
            return $rt_createBooleanArray(var$2);
        }
    } else {
        return $rt_createArray(var$1, var$2)
    }
}
function jl_NullPointerException() {
    jl_RuntimeException.call(this);
}
function jl_NullPointerException__init_() {
    var $r = new jl_NullPointerException();
    jl_NullPointerException__init_1($r);
    return $r;
}
function jl_NullPointerException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
function jl_NegativeArraySizeException() {
    jl_RuntimeException.call(this);
}
function jl_NegativeArraySizeException__init_() {
    var $r = new jl_NegativeArraySizeException();
    jl_NegativeArraySizeException__init_1($r);
    return $r;
}
function jl_NegativeArraySizeException__init_1($this) {
    jl_RuntimeException__init_1($this);
}
$rt_metadata([jl_Object, "java.lang.Object", 0, [], 3072, 3, 0, ["$isEmptyMonitor", function() { return jl_Object_isEmptyMonitor(this); }, "$_init_", function() { jl_Object__init_1(this); }, "$getClass1", function() { return jl_Object_getClass(this); }, "$clone", function() { return jl_Object_clone(this); }, "$notifyAll", function() { jl_Object_notifyAll(this); }],
otju_Client, "org.teavm.javac.ui.Client", jl_Object, [], 3104, 3, otju_Client_$callClinit, [],
otj_JSObject, "org.teavm.jso.JSObject", jl_Object, [], 65, 3, 0, [],
otjdx_Node, "org.teavm.jso.dom.xml.Node", jl_Object, [otj_JSObject], 65, 3, 0, [],
otjdx_Document, "org.teavm.jso.dom.xml.Document", jl_Object, [otjdx_Node], 65, 3, 0, [],
otjde_EventTarget, "org.teavm.jso.dom.events.EventTarget", jl_Object, [otj_JSObject], 65, 3, 0, [],
otjdh_HTMLDocument, "org.teavm.jso.dom.html.HTMLDocument", jl_Object, [otjdx_Document, otjde_EventTarget], 65, 3, 0, [],
otji_JS, "org.teavm.jso.impl.JS", jl_Object, [], 3104, 0, 0, [],
otjde_EventListener, "org.teavm.jso.dom.events.EventListener", jl_Object, [otj_JSObject], 65, 3, 0, [],
$$LAMBDA0$$, "$$LAMBDA0$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA0$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA0$$_handleEvent(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA0$$_handleEvent$exported$0(this, var_1); }],
jlr_AnnotatedElement, "java.lang.reflect.AnnotatedElement", jl_Object, [], 65, 3, 0, [],
jl_Class, "java.lang.Class", jl_Object, [jlr_AnnotatedElement], 3072, 3, 0, ["$_init_9", function(var_1) { jl_Class__init_1(this, var_1); }, "$getPlatformClass", function() { return jl_Class_getPlatformClass(this); }, "$getComponentType", function() { return jl_Class_getComponentType(this); }],
otp_Platform, "org.teavm.platform.Platform", jl_Object, [], 3104, 3, 0, [],
ji_Serializable, "java.io.Serializable", jl_Object, [], 65, 3, 0, [],
jl_Comparable, "java.lang.Comparable", jl_Object, [], 65, 3, 0, [],
jl_CharSequence, "java.lang.CharSequence", jl_Object, [], 65, 3, 0, [],
jl_String, "java.lang.String", jl_Object, [ji_Serializable, jl_Comparable, jl_CharSequence], 3072, 3, jl_String_$callClinit, ["$_init_27", function(var_1) { jl_String__init_1(this, var_1); }, "$_init_10", function(var_1, var_2, var_3) { jl_String__init_3(this, var_1, var_2, var_3); }, "$charAt", function(var_1) { return jl_String_charAt(this, var_1); }, "$length", function() { return jl_String_length(this); }, "$isEmpty", function() { return jl_String_isEmpty(this); }, "$getChars", function(var_1, var_2, var_3,
var_4) { jl_String_getChars(this, var_1, var_2, var_3, var_4); }, "$substring", function(var_1, var_2) { return jl_String_substring(this, var_1, var_2); }, "$substring1", function(var_1) { return jl_String_substring1(this, var_1); }, "$equals", function(var_1) { return jl_String_equals(this, var_1); }, "$hashCode", function() { return jl_String_hashCode(this); }, "$intern", function() { return jl_String_intern(this); }],
jl_Throwable, "java.lang.Throwable", jl_Object, [], 3072, 3, 0, ["$_init_", function() { jl_Throwable__init_1(this); }, "$_init_1", function(var_1) { jl_Throwable__init_3(this, var_1); }, "$fillInStackTrace", function() { return jl_Throwable_fillInStackTrace(this); }],
jl_Exception, "java.lang.Exception", jl_Throwable, [], 3072, 3, 0, ["$_init_", function() { jl_Exception__init_1(this); }, "$_init_1", function(var_1) { jl_Exception__init_3(this, var_1); }],
jl_RuntimeException, "java.lang.RuntimeException", jl_Exception, [], 3072, 3, 0, ["$_init_", function() { jl_RuntimeException__init_1(this); }],
jl_IndexOutOfBoundsException, "java.lang.IndexOutOfBoundsException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { jl_IndexOutOfBoundsException__init_1(this); }],
jl_Cloneable, "java.lang.Cloneable", jl_Object, [], 65, 3, 0, [],
jl_CloneNotSupportedException, "java.lang.CloneNotSupportedException", jl_Exception, [], 3072, 3, 0, ["$_init_", function() { jl_CloneNotSupportedException__init_1(this); }],
jl_Runnable, "java.lang.Runnable", jl_Object, [], 65, 3, 0, [],
jl_Thread, "java.lang.Thread", jl_Object, [jl_Runnable], 3072, 3, jl_Thread_$callClinit, ["$_init_1", function(var_1) { jl_Thread__init_2(this, var_1); }, "$_init_8", function(var_1) { jl_Thread__init_3(this, var_1); }, "$_init_11", function(var_1, var_2) { jl_Thread__init_5(this, var_1, var_2); }, "$start", function() { jl_Thread_start(this); }, "$run", function() { jl_Thread_run(this); }, "$lambda$start$0", function() { jl_Thread_lambda$start$0(this); }],
jl_System, "java.lang.System", jl_Object, [], 3104, 3, jl_System_$callClinit, [],
jl_Error, "java.lang.Error", jl_Throwable, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_Error__init_1(this, var_1); }],
jl_LinkageError, "java.lang.LinkageError", jl_Error, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_LinkageError__init_1(this, var_1); }],
jl_NoClassDefFoundError, "java.lang.NoClassDefFoundError", jl_LinkageError, [], 3072, 3, 0, [],
jl_IncompatibleClassChangeError, "java.lang.IncompatibleClassChangeError", jl_LinkageError, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_IncompatibleClassChangeError__init_1(this, var_1); }],
jl_NoSuchFieldError, "java.lang.NoSuchFieldError", jl_IncompatibleClassChangeError, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_NoSuchFieldError__init_1(this, var_1); }],
jl_NoSuchMethodError, "java.lang.NoSuchMethodError", jl_IncompatibleClassChangeError, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_NoSuchMethodError__init_1(this, var_1); }],
otjde_FocusEventTarget, "org.teavm.jso.dom.events.FocusEventTarget", jl_Object, [otjde_EventTarget], 65, 3, 0, [],
otjde_MouseEventTarget, "org.teavm.jso.dom.events.MouseEventTarget", jl_Object, [otjde_EventTarget], 65, 3, 0, [],
otjde_KeyboardEventTarget, "org.teavm.jso.dom.events.KeyboardEventTarget", jl_Object, [otjde_EventTarget], 65, 3, 0, [],
otjde_LoadEventTarget, "org.teavm.jso.dom.events.LoadEventTarget", jl_Object, [otjde_EventTarget], 65, 3, 0, [],
otjb_WindowEventTarget, "org.teavm.jso.browser.WindowEventTarget", jl_Object, [otjde_EventTarget, otjde_FocusEventTarget, otjde_MouseEventTarget, otjde_KeyboardEventTarget, otjde_LoadEventTarget], 65, 3, 0, [],
otjb_StorageProvider, "org.teavm.jso.browser.StorageProvider", jl_Object, [], 65, 3, 0, [],
otjc_JSArrayReader, "org.teavm.jso.core.JSArrayReader", jl_Object, [otj_JSObject], 65, 3, 0, [],
otjb_Window, "org.teavm.jso.browser.Window", jl_Object, [otj_JSObject, otjb_WindowEventTarget, otjb_StorageProvider, otjc_JSArrayReader], 3073, 3, 0, ["$removeEventListener$exported$0", function(var_1, var_2) { return otjb_Window_removeEventListener$exported$0(this, var_1, var_2); }, "$removeEventListener$exported$1", function(var_1, var_2, var_3) { return otjb_Window_removeEventListener$exported$1(this, var_1, var_2, var_3); }, "$dispatchEvent$exported$2", function(var_1) { return otjb_Window_dispatchEvent$exported$2(this,
var_1); }, "$addEventListener$exported$3", function(var_1, var_2) { return otjb_Window_addEventListener$exported$3(this, var_1, var_2); }, "$get$exported$4", function(var_1) { return otjb_Window_get$exported$4(this, var_1); }, "$getLength$exported$5", function() { return otjb_Window_getLength$exported$5(this); }, "$addEventListener$exported$6", function(var_1, var_2, var_3) { return otjb_Window_addEventListener$exported$6(this, var_1, var_2, var_3); }],
otjuc_CodeMirror, "org.teavm.javac.ui.codemirror.CodeMirror", jl_Object, [otj_JSObject], 3073, 3, 0, [],
$$LAMBDA1$$, "$$LAMBDA1$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA1$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA1$$_handleEvent(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA1$$_handleEvent$exported$0(this, var_1); }],
$$LAMBDA2$$, "$$LAMBDA2$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA2$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA2$$_handleEvent(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA2$$_handleEvent$exported$0(this, var_1); }],
$$LAMBDA3$$, "$$LAMBDA3$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA3$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA3$$_handleEvent(this, var_1); }, "$handleEvent1", function(var_1) { $$LAMBDA3$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA3$$_handleEvent$exported$0(this, var_1); }],
$$LAMBDA4$$, "$$LAMBDA4$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA4$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA4$$_handleEvent(this, var_1); }, "$handleEvent1", function(var_1) { $$LAMBDA4$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA4$$_handleEvent$exported$0(this, var_1); }],
otja_XMLHttpRequest, "org.teavm.jso.ajax.XMLHttpRequest", jl_Object, [otj_JSObject], 3073, 3, 0, [],
jl_AbstractStringBuilder, "java.lang.AbstractStringBuilder", jl_Object, [ji_Serializable, jl_CharSequence], 3072, 0, jl_AbstractStringBuilder_$callClinit, ["$_init_", function() { jl_AbstractStringBuilder__init_1(this); }, "$_init_15", function(var_1) { jl_AbstractStringBuilder__init_3(this, var_1); }, "$_init_1", function(var_1) { jl_AbstractStringBuilder__init_5(this, var_1); }, "$_init_16", function(var_1) { jl_AbstractStringBuilder__init_7(this, var_1); }, "$append4", function(var_1) { return jl_AbstractStringBuilder_append(this,
var_1); }, "$insert", function(var_1, var_2) { return jl_AbstractStringBuilder_insert(this, var_1, var_2); }, "$append5", function(var_1) { return jl_AbstractStringBuilder_append1(this, var_1); }, "$append3", function(var_1, var_2) { return jl_AbstractStringBuilder_append2(this, var_1, var_2); }, "$insert1", function(var_1, var_2, var_3) { return jl_AbstractStringBuilder_insert1(this, var_1, var_2, var_3); }, "$append6", function(var_1) { return jl_AbstractStringBuilder_append3(this, var_1); }, "$insert2", function(var_1,
var_2) { return jl_AbstractStringBuilder_insert2(this, var_1, var_2); }, "$ensureCapacity", function(var_1) { jl_AbstractStringBuilder_ensureCapacity(this, var_1); }, "$toString", function() { return jl_AbstractStringBuilder_toString(this); }, "$insertSpace", function(var_1, var_2) { jl_AbstractStringBuilder_insertSpace(this, var_1, var_2); }],
jl_Appendable, "java.lang.Appendable", jl_Object, [], 65, 3, 0, [],
jl_StringBuilder, "java.lang.StringBuilder", jl_AbstractStringBuilder, [jl_Appendable], 3072, 3, 0, ["$_init_", function() { jl_StringBuilder__init_2(this); }, "$_init_1", function(var_1) { jl_StringBuilder__init_3(this, var_1); }, "$append", function(var_1) { return jl_StringBuilder_append(this, var_1); }, "$append1", function(var_1) { return jl_StringBuilder_append1(this, var_1); }, "$append2", function(var_1) { return jl_StringBuilder_append2(this, var_1); }, "$insert3", function(var_1, var_2) { return jl_StringBuilder_insert2(this,
var_1, var_2); }, "$insert4", function(var_1, var_2) { return jl_StringBuilder_insert3(this, var_1, var_2); }, "$toString", function() { return jl_StringBuilder_toString(this); }, "$ensureCapacity", function(var_1) { jl_StringBuilder_ensureCapacity(this, var_1); }, "$insert2", function(var_1, var_2) { return jl_StringBuilder_insert1(this, var_1, var_2); }, "$insert", function(var_1, var_2) { return jl_StringBuilder_insert(this, var_1, var_2); }],
$$LAMBDA5$$, "$$LAMBDA5$$", jl_Object, [jl_Runnable], 0, 3, 0, ["$_init_4", function(var_1) { $$LAMBDA5$$__init_1(this, var_1); }, "$run", function() { $$LAMBDA5$$_run(this); }],
$$LAMBDA6$$, "$$LAMBDA6$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_", function() { $$LAMBDA6$$__init_1(this); }, "$handleEvent", function(var_1) { $$LAMBDA6$$_handleEvent(this, var_1); }, "$handleEvent2", function(var_1) { $$LAMBDA6$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA6$$_handleEvent$exported$0(this, var_1); }],
otjw_AbstractWorker, "org.teavm.jso.workers.AbstractWorker", jl_Object, [otj_JSObject, otjde_EventTarget], 65, 3, 0, [],
otjw_Worker, "org.teavm.jso.workers.Worker", jl_Object, [otjw_AbstractWorker], 3073, 3, 0, ["$removeEventListener$exported$0", function(var_1, var_2) { return otjw_Worker_removeEventListener$exported$0(this, var_1, var_2); }, "$removeEventListener$exported$1", function(var_1, var_2, var_3) { return otjw_Worker_removeEventListener$exported$1(this, var_1, var_2, var_3); }, "$dispatchEvent$exported$2", function(var_1) { return otjw_Worker_dispatchEvent$exported$2(this, var_1); }, "$addEventListener$exported$3",
function(var_1, var_2) { return otjw_Worker_addEventListener$exported$3(this, var_1, var_2); }, "$addEventListener$exported$4", function(var_1, var_2, var_3) { return otjw_Worker_addEventListener$exported$4(this, var_1, var_2, var_3); }, "$onError$exported$5", function(var_1) { return otjw_Worker_onError$exported$5(this, var_1); }],
ju_Map, "java.util.Map", jl_Object, [], 65, 3, 0, [],
ju_AbstractMap, "java.util.AbstractMap", jl_Object, [ju_Map], 3073, 3, 0, ["$_init_", function() { ju_AbstractMap__init_1(this); }],
ju_HashMap, "java.util.HashMap", ju_AbstractMap, [jl_Cloneable, ji_Serializable], 3072, 3, 0, ["$newElementArray", function(var_1) { return ju_HashMap_newElementArray(this, var_1); }, "$_init_", function() { ju_HashMap__init_1(this); }, "$_init_15", function(var_1) { ju_HashMap__init_3(this, var_1); }, "$_init_17", function(var_1, var_2) { ju_HashMap__init_5(this, var_1, var_2); }, "$computeThreshold", function() { ju_HashMap_computeThreshold(this); }, "$entrySet", function() { return ju_HashMap_entrySet(this);
}, "$get", function(var_1) { return ju_HashMap_get(this, var_1); }, "$getEntry", function(var_1) { return ju_HashMap_getEntry(this, var_1); }, "$findNonNullKeyEntry", function(var_1, var_2, var_3) { return ju_HashMap_findNonNullKeyEntry(this, var_1, var_2, var_3); }, "$findNullKeyEntry", function() { return ju_HashMap_findNullKeyEntry(this); }, "$put", function(var_1, var_2) { return ju_HashMap_put(this, var_1, var_2); }, "$putImpl", function(var_1, var_2) { return ju_HashMap_putImpl(this, var_1, var_2); },
"$createHashedEntry", function(var_1, var_2, var_3) { return ju_HashMap_createHashedEntry(this, var_1, var_2, var_3); }, "$rehash1", function(var_1) { ju_HashMap_rehash1(this, var_1); }, "$rehash", function() { ju_HashMap_rehash(this); }, "$removeEntry", function(var_1) { return ju_HashMap_removeEntry(this, var_1); }],
otjc_JSArray, "org.teavm.jso.core.JSArray", jl_Object, [otjc_JSArrayReader], 3073, 3, 0, ["$get$exported$0", function(var_1) { return otjc_JSArray_get$exported$0(this, var_1); }, "$getLength$exported$1", function() { return otjc_JSArray_getLength$exported$1(this); }],
otjc_JSString, "org.teavm.jso.core.JSString", jl_Object, [otj_JSObject], 3073, 3, 0, [],
otja_ReadyStateChangeHandler, "org.teavm.jso.ajax.ReadyStateChangeHandler", jl_Object, [otj_JSObject], 65, 3, 0, [],
$$LAMBDA7$$, "$$LAMBDA7$$", jl_Object, [otja_ReadyStateChangeHandler], 0, 3, 0, ["$_init_14", function(var_1, var_2) { $$LAMBDA7$$__init_1(this, var_1, var_2); }, "$stateChanged", function() { $$LAMBDA7$$_stateChanged(this); }, "$stateChanged$exported$0", function() { return $$LAMBDA7$$_stateChanged$exported$0(this); }],
otpa_AsyncCallback, "org.teavm.platform.async.AsyncCallback", jl_Object, [], 65, 3, 0, [],
otpp_AsyncCallbackWrapper, "org.teavm.platform.plugin.AsyncCallbackWrapper", jl_Object, [otpa_AsyncCallback], 3072, 0, 0, ["$_init_20", function(var_1) { otpp_AsyncCallbackWrapper__init_1(this, var_1); }, "$complete", function(var_1) { otpp_AsyncCallbackWrapper_complete(this, var_1); }, "$error", function(var_1) { otpp_AsyncCallbackWrapper_error(this, var_1); }],
otju_Client$1ResponseWait, "org.teavm.javac.ui.Client$1ResponseWait", jl_Object, [], 3072, 0, 0, ["$_init_7", function(var_1, var_2) { otju_Client$1ResponseWait__init_1(this, var_1, var_2); }, "$run", function() { otju_Client$1ResponseWait_run(this); }, "$lambda$run$0", function(var_1, var_2, var_3) { otju_Client$1ResponseWait_lambda$run$0(this, var_1, var_2, var_3); }],
ju_Comparator, "java.util.Comparator", jl_Object, [], 65, 3, 0, [],
$$LAMBDA8$$, "$$LAMBDA8$$", jl_Object, [ju_Comparator], 0, 3, 0, ["$_init_", function() { $$LAMBDA8$$__init_1(this); }],
jl_AutoCloseable, "java.lang.AutoCloseable", jl_Object, [], 65, 3, 0, [],
ji_Closeable, "java.io.Closeable", jl_Object, [jl_AutoCloseable], 65, 3, 0, [],
ji_Flushable, "java.io.Flushable", jl_Object, [], 65, 3, 0, [],
ji_OutputStream, "java.io.OutputStream", jl_Object, [ji_Closeable, ji_Flushable], 3073, 3, 0, ["$_init_", function() { ji_OutputStream__init_1(this); }],
ji_FilterOutputStream, "java.io.FilterOutputStream", ji_OutputStream, [], 3072, 3, 0, ["$_init_22", function(var_1) { ji_FilterOutputStream__init_1(this, var_1); }],
ji_PrintStream, "java.io.PrintStream", ji_FilterOutputStream, [], 3072, 3, 0, ["$_init_13", function(var_1, var_2) { ji_PrintStream__init_1(this, var_1, var_2); }],
jl_ConsoleOutputStreamStdout, "java.lang.ConsoleOutputStreamStdout", ji_OutputStream, [], 3072, 0, 0, ["$_init_", function() { jl_ConsoleOutputStreamStdout__init_1(this); }],
jl_ConsoleOutputStreamStderr, "java.lang.ConsoleOutputStreamStderr", ji_OutputStream, [], 3072, 0, 0, ["$_init_", function() { jl_ConsoleOutputStreamStderr__init_1(this); }],
ji_InputStream, "java.io.InputStream", jl_Object, [ji_Closeable], 3073, 3, 0, ["$_init_", function() { ji_InputStream__init_1(this); }],
jl_ConsoleInputStream, "java.lang.ConsoleInputStream", ji_InputStream, [], 3072, 0, 0, ["$_init_", function() { jl_ConsoleInputStream__init_1(this); }],
jnc_Charset, "java.nio.charset.Charset", jl_Object, [jl_Comparable], 3073, 3, jnc_Charset_$callClinit, ["$_init_23", function(var_1, var_2) { jnc_Charset__init_1(this, var_1, var_2); }],
jnci_UTF8Charset, "java.nio.charset.impl.UTF8Charset", jnc_Charset, [], 3072, 3, 0, ["$_init_", function() { jnci_UTF8Charset__init_1(this); }],
jl_IllegalArgumentException, "java.lang.IllegalArgumentException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { jl_IllegalArgumentException__init_1(this); }],
jnc_IllegalCharsetNameException, "java.nio.charset.IllegalCharsetNameException", jl_IllegalArgumentException, [], 3072, 3, 0, ["$_init_1", function(var_1) { jnc_IllegalCharsetNameException__init_1(this, var_1); }],
ju_Map$Entry, "java.util.Map$Entry", jl_Object, [], 65, 3, 0, [],
ju_MapEntry, "java.util.MapEntry", jl_Object, [ju_Map$Entry, jl_Cloneable], 3072, 0, 0, ["$_init_24", function(var_1, var_2) { ju_MapEntry__init_1(this, var_1, var_2); }, "$getKey", function() { return ju_MapEntry_getKey(this); }, "$getValue", function() { return ju_MapEntry_getValue(this); }],
ju_HashMap$HashEntry, "java.util.HashMap$HashEntry", ju_MapEntry, [], 3072, 0, 0, ["$_init_19", function(var_1, var_2) { ju_HashMap$HashEntry__init_1(this, var_1, var_2); }],
jl_StringIndexOutOfBoundsException, "java.lang.StringIndexOutOfBoundsException", jl_IndexOutOfBoundsException, [], 3072, 3, 0, ["$_init_", function() { jl_StringIndexOutOfBoundsException__init_1(this); }],
$$LAMBDA9$$, "$$LAMBDA9$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_21", function(var_1, var_2, var_3) { $$LAMBDA9$$__init_1(this, var_1, var_2, var_3); }, "$handleEvent", function(var_1) { $$LAMBDA9$$_handleEvent(this, var_1); }, "$handleEvent2", function(var_1) { $$LAMBDA9$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA9$$_handleEvent$exported$0(this, var_1); }],
$$LAMBDA10$$, "$$LAMBDA10$$", jl_Object, [jl_Runnable], 0, 3, 0, ["$_init_", function() { $$LAMBDA10$$__init_1(this); }, "$run", function() { $$LAMBDA10$$_run(this); }],
otjj_JSON, "org.teavm.jso.json.JSON", jl_Object, [], 3104, 3, 0, [],
otjdx_Element, "org.teavm.jso.dom.xml.Element", jl_Object, [otjdx_Node], 65, 3, 0, [],
otjdc_ElementCSSInlineStyle, "org.teavm.jso.dom.css.ElementCSSInlineStyle", jl_Object, [otj_JSObject], 65, 3, 0, [],
otjde_WheelEventTarget, "org.teavm.jso.dom.events.WheelEventTarget", jl_Object, [otjde_EventTarget], 65, 3, 0, [],
otjdh_HTMLElement, "org.teavm.jso.dom.html.HTMLElement", jl_Object, [otjdx_Element, otjdc_ElementCSSInlineStyle, otjde_EventTarget, otjde_FocusEventTarget, otjde_MouseEventTarget, otjde_WheelEventTarget, otjde_KeyboardEventTarget, otjde_LoadEventTarget], 65, 3, 0, [],
jl_Math, "java.lang.Math", jl_Object, [], 3104, 3, 0, [],
otp_PlatformRunnable, "org.teavm.platform.PlatformRunnable", jl_Object, [], 65, 3, 0, [],
$$LAMBDA11$$, "$$LAMBDA11$$", jl_Object, [otp_PlatformRunnable], 0, 3, 0, ["$_init_12", function(var_1) { $$LAMBDA11$$__init_1(this, var_1); }, "$run", function() { $$LAMBDA11$$_run(this); }],
otju_Client$ExampleCategory, "org.teavm.javac.ui.Client$ExampleCategory", jl_Object, [], 3072, 0, 0, ["$_init_", function() { otju_Client$ExampleCategory__init_1(this); }],
$$LAMBDA12$$, "$$LAMBDA12$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_5", function(var_1, var_2) { $$LAMBDA12$$__init_1(this, var_1, var_2); }, "$handleEvent", function(var_1) { $$LAMBDA12$$_handleEvent(this, var_1); }, "$handleEvent1", function(var_1) { $$LAMBDA12$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA12$$_handleEvent$exported$0(this, var_1); }],
ju_LinkedHashMap, "java.util.LinkedHashMap", ju_HashMap, [ju_Map], 3072, 3, 0, ["$_init_", function() { ju_LinkedHashMap__init_1(this); }, "$newElementArray", function(var_1) { return ju_LinkedHashMap_newElementArray(this, var_1); }, "$createHashedEntry", function(var_1, var_2, var_3) { return ju_LinkedHashMap_createHashedEntry(this, var_1, var_2, var_3); }, "$put", function(var_1, var_2) { return ju_LinkedHashMap_put(this, var_1, var_2); }, "$putImpl", function(var_1, var_2) { return ju_LinkedHashMap_putImpl(this,
var_1, var_2); }, "$linkEntry", function(var_1) { ju_LinkedHashMap_linkEntry(this, var_1); }, "$entrySet", function() { return ju_LinkedHashMap_entrySet(this); }, "$remove", function(var_1) { return ju_LinkedHashMap_remove(this, var_1); }, "$removeEldestEntry", function(var_1) { return ju_LinkedHashMap_removeEldestEntry(this, var_1); }],
jl_Iterable, "java.lang.Iterable", jl_Object, [], 65, 3, 0, [],
ju_Collection, "java.util.Collection", jl_Object, [jl_Iterable], 65, 3, 0, [],
ju_AbstractCollection, "java.util.AbstractCollection", jl_Object, [ju_Collection], 3073, 3, 0, ["$_init_", function() { ju_AbstractCollection__init_1(this); }],
ju_Set, "java.util.Set", jl_Object, [ju_Collection], 65, 3, 0, [],
ju_AbstractSet, "java.util.AbstractSet", ju_AbstractCollection, [ju_Set], 3073, 3, 0, ["$_init_", function() { ju_AbstractSet__init_1(this); }],
ju_HashMap$HashMapEntrySet, "java.util.HashMap$HashMapEntrySet", ju_AbstractSet, [], 3072, 0, 0, ["$_init_18", function(var_1) { ju_HashMap$HashMapEntrySet__init_1(this, var_1); }, "$hashMap", function() { return ju_HashMap$HashMapEntrySet_hashMap(this); }, "$iterator", function() { return ju_HashMap$HashMapEntrySet_iterator(this); }],
ju_LinkedHashMap$LinkedHashMapEntry, "java.util.LinkedHashMap$LinkedHashMapEntry", ju_HashMap$HashEntry, [], 3104, 0, 0, ["$_init_19", function(var_1, var_2) { ju_LinkedHashMap$LinkedHashMapEntry__init_1(this, var_1, var_2); }],
ju_LinkedHashMap$LinkedHashMapEntrySet, "java.util.LinkedHashMap$LinkedHashMapEntrySet", ju_HashMap$HashMapEntrySet, [], 3104, 0, 0, ["$_init_25", function(var_1) { ju_LinkedHashMap$LinkedHashMapEntrySet__init_1(this, var_1); }, "$iterator", function() { return ju_LinkedHashMap$LinkedHashMapEntrySet_iterator(this); }],
jl_Character, "java.lang.Character", jl_Object, [jl_Comparable], 3072, 3, jl_Character_$callClinit, [],
$$LAMBDA13$$, "$$LAMBDA13$$", jl_Object, [jl_Runnable], 0, 3, 0, ["$_init_6", function(var_1, var_2) { $$LAMBDA13$$__init_1(this, var_1, var_2); }, "$run", function() { $$LAMBDA13$$_run(this); }],
ju_HashMap$AbstractMapIterator, "java.util.HashMap$AbstractMapIterator", jl_Object, [], 3072, 0, 0, ["$_init_18", function(var_1) { ju_HashMap$AbstractMapIterator__init_1(this, var_1); }, "$hasNext", function() { return ju_HashMap$AbstractMapIterator_hasNext(this); }, "$checkConcurrentMod", function() { ju_HashMap$AbstractMapIterator_checkConcurrentMod(this); }, "$makeNext", function() { ju_HashMap$AbstractMapIterator_makeNext(this); }],
ju_Iterator, "java.util.Iterator", jl_Object, [], 65, 3, 0, [],
ju_HashMap$EntryIterator, "java.util.HashMap$EntryIterator", ju_HashMap$AbstractMapIterator, [ju_Iterator], 3072, 0, 0, ["$_init_18", function(var_1) { ju_HashMap$EntryIterator__init_1(this, var_1); }, "$next2", function() { return ju_HashMap$EntryIterator_next1(this); }, "$next", function() { return ju_HashMap$EntryIterator_next(this); }],
ju_LinkedHashMap$AbstractMapIterator, "java.util.LinkedHashMap$AbstractMapIterator", jl_Object, [], 3072, 0, 0, ["$_init_25", function(var_1) { ju_LinkedHashMap$AbstractMapIterator__init_1(this, var_1); }, "$hasNext", function() { return ju_LinkedHashMap$AbstractMapIterator_hasNext(this); }, "$checkConcurrentMod", function() { ju_LinkedHashMap$AbstractMapIterator_checkConcurrentMod(this); }, "$makeNext", function() { ju_LinkedHashMap$AbstractMapIterator_makeNext(this); }],
ju_LinkedHashMap$EntryIterator, "java.util.LinkedHashMap$EntryIterator", ju_LinkedHashMap$AbstractMapIterator, [ju_Iterator], 3072, 0, 0, ["$_init_25", function(var_1) { ju_LinkedHashMap$EntryIterator__init_1(this, var_1); }, "$next2", function() { return ju_LinkedHashMap$EntryIterator_next1(this); }, "$next", function() { return ju_LinkedHashMap$EntryIterator_next(this); }],
jl_IllegalMonitorStateException, "java.lang.IllegalMonitorStateException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { jl_IllegalMonitorStateException__init_1(this); }],
jl_Object$Monitor, "java.lang.Object$Monitor", jl_Object, [], 3072, 0, 0, ["$_init_", function() { jl_Object$Monitor__init_1(this); }],
jl_IllegalStateException, "java.lang.IllegalStateException", jl_Exception, [], 3072, 3, 0, ["$_init_1", function(var_1) { jl_IllegalStateException__init_1(this, var_1); }],
ju_Arrays, "java.util.Arrays", jl_Object, [], 3072, 3, 0, [],
otp_PlatformQueue, "org.teavm.platform.PlatformQueue", jl_Object, [otj_JSObject], 3073, 3, 0, [],
$$LAMBDA14$$, "$$LAMBDA14$$", jl_Object, [otp_PlatformRunnable], 0, 3, 0, ["$_init_3", function(var_1) { $$LAMBDA14$$__init_1(this, var_1); }, "$run", function() { $$LAMBDA14$$_run(this); }],
$$LAMBDA15$$, "$$LAMBDA15$$", jl_Object, [otp_PlatformRunnable], 0, 3, 0, ["$_init_2", function(var_1, var_2, var_3, var_4) { $$LAMBDA15$$__init_1(this, var_1, var_2, var_3, var_4); }, "$run", function() { $$LAMBDA15$$_run(this); }],
otju_PositionIndexer, "org.teavm.javac.ui.PositionIndexer", jl_Object, [], 3072, 3, 0, ["$_init_1", function(var_1) { otju_PositionIndexer__init_1(this, var_1); }, "$getPositionAt", function(var_1, var_2) { return otju_PositionIndexer_getPositionAt(this, var_1, var_2); }],
$$LAMBDA16$$, "$$LAMBDA16$$", jl_Object, [otjde_EventListener], 0, 3, 0, ["$_init_1", function(var_1) { $$LAMBDA16$$__init_1(this, var_1); }, "$handleEvent", function(var_1) { $$LAMBDA16$$_handleEvent(this, var_1); }, "$handleEvent2", function(var_1) { $$LAMBDA16$$_handleEvent1(this, var_1); }, "$handleEvent$exported$0", function(var_1) { return $$LAMBDA16$$_handleEvent$exported$0(this, var_1); }],
ju_List, "java.util.List", jl_Object, [ju_Collection], 65, 3, 0, [],
ju_AbstractList, "java.util.AbstractList", ju_AbstractCollection, [ju_List], 3073, 3, 0, ["$_init_", function() { ju_AbstractList__init_1(this); }],
ju_ArrayList, "java.util.ArrayList", ju_AbstractList, [jl_Cloneable, ji_Serializable], 3072, 3, 0, ["$_init_", function() { ju_ArrayList__init_1(this); }, "$_init_15", function(var_1) { ju_ArrayList__init_3(this, var_1); }, "$ensureCapacity", function(var_1) { ju_ArrayList_ensureCapacity(this, var_1); }, "$get2", function(var_1) { return ju_ArrayList_get(this, var_1); }, "$size", function() { return ju_ArrayList_size(this); }, "$add", function(var_1) { return ju_ArrayList_add(this, var_1); }, "$checkIndex",
function(var_1) { ju_ArrayList_checkIndex(this, var_1); }],
jl_Number, "java.lang.Number", jl_Object, [ji_Serializable], 3073, 3, 0, ["$_init_", function() { jl_Number__init_1(this); }],
jl_Integer, "java.lang.Integer", jl_Number, [jl_Comparable], 3072, 3, jl_Integer_$callClinit, ["$_init_15", function(var_1) { jl_Integer__init_1(this, var_1); }, "$intValue", function() { return jl_Integer_intValue(this); }],
otju_Position, "org.teavm.javac.ui.Position", jl_Object, [], 3072, 3, 0, ["$_init_26", function(var_1, var_2) { otju_Position__init_1(this, var_1, var_2); }],
otjuc_TextLocation, "org.teavm.javac.ui.codemirror.TextLocation", jl_Object, [otj_JSObject], 3073, 3, 0, [],
ju_NoSuchElementException, "java.util.NoSuchElementException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { ju_NoSuchElementException__init_1(this); }],
ju_ConcurrentModificationException, "java.util.ConcurrentModificationException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { ju_ConcurrentModificationException__init_1(this); }],
jlr_Array, "java.lang.reflect.Array", jl_Object, [], 3104, 3, 0, [],
jl_NullPointerException, "java.lang.NullPointerException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { jl_NullPointerException__init_1(this); }],
jl_NegativeArraySizeException, "java.lang.NegativeArraySizeException", jl_RuntimeException, [], 3072, 3, 0, ["$_init_", function() { jl_NegativeArraySizeException__init_1(this); }]]);
$rt_stringPool(["Can\'t enter monitor from another thread synchronously", "click", "diagnostics", "CodeMirror-linenumbers", "get", "examples.json", "display", "block", "/", ".java", "class", "modal-backdrop fade in", "none", "message", "[property=workerLocation]", "[property=stdlibLocation]", "load-classlib", "ok", "Could not load standard library: ", "compile", "diagnostic", "compiler-diagnostic", "compilation-complete", "successful", "MANDATORY_WARNING", "ERROR", "WARNING", "WARNING ", "ERROR ", "at ", "(",
":", ")", "warning-sign gutter-warning", "exclamation-sign gutter-error", "glyphicon glyphicon-", "\n", "teavm-java-code", "ready", "stdout", "examples/", "main", "blur", "beforeunload", "null", "UTF-8"]);
var main = otju_Client_main;
(function() {
    var c;
    c = $$LAMBDA0$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = otjb_Window.prototype;
    c.removeEventListener = c.$removeEventListener$exported$0;
    c.removeEventListener = c.$removeEventListener$exported$1;
    c.dispatchEvent = c.$dispatchEvent$exported$2;
    c.getLength = c.$getLength$exported$5;
    c.addEventListener = c.$addEventListener$exported$3;
    c.get = c.$get$exported$4;
    c.addEventListener = c.$addEventListener$exported$6;
    c = $$LAMBDA1$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA2$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA3$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA4$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA6$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = otjw_Worker.prototype;
    c.removeEventListener = c.$removeEventListener$exported$0;
    c.removeEventListener = c.$removeEventListener$exported$1;
    c.addEventListener = c.$addEventListener$exported$4;
    c.dispatchEvent = c.$dispatchEvent$exported$2;
    c.addEventListener = c.$addEventListener$exported$3;
    c.onError = c.$onError$exported$5;
    c = otjc_JSArray.prototype;
    c.get = c.$get$exported$0;
    c.getLength = c.$getLength$exported$1;
    c = $$LAMBDA7$$.prototype;
    c.stateChanged = c.$stateChanged$exported$0;
    c = $$LAMBDA9$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA12$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
    c = $$LAMBDA16$$.prototype;
    c.handleEvent = c.$handleEvent$exported$0;
})();
main = $rt_mainStarter(main);

//# sourceMappingURL=classes.js.map