/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ExportType'],function(E){'use strict';var r=/[\r\n"]/;var C=E.extend('sap.ui.core.util.ExportTypeCSV',{metadata:{library:"sap.ui.core",properties:{separatorChar:{type:'string',defaultValue:','}}}});C.prototype.setSeparatorChar=function(s){var s=this.validateProperty('separatorChar',s);if(s.length>1){throw new Error("Value of property \"separatorChar\" needs to be exactly one character or empty. "+"\""+s+"\" is "+s.length+" characters long.");}return this.setProperty('separatorChar',s);};C.prototype.init=function(){this.setProperty('fileExtension','csv',true);this.setProperty('mimeType','text/csv',true);this.setProperty('charset','utf-8',true);};C.prototype.escapeContent=function(v){if(!v){return v;}var c=v.indexOf(this.getSeparatorChar())>-1;if(c||r.test(v)){v=v.replace(/"/g,'""');v='"'+v+'"';}return v;};C.prototype.generate=function(){var b=[];this.generateColumns(b);this.generateRows(b);return b.join('\r\n');};C.prototype.generateColumns=function(b){var c=[],o=this.columnGenerator(),a;while(!(a=o.next()).done){c.push(this.escapeContent(a.value.name));}b.push(c.join(this.getSeparatorChar()));};C.prototype.generateRows=function(b){var R=this.rowGenerator(),o;while(!(o=R.next()).done){var a=[];var c=o.value.cells,d;while(!(d=c.next()).done){a.push(this.escapeContent(d.value.content));}b.push(a.join(this.getSeparatorChar()));}};return C;});
