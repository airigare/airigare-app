/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TableExtension','./TableUtils','sap/ui/Device'],function(q,T,a,D){"use strict";var C={initColumnResizing:function(t,e){if(t._bIsColumnResizerMoving){return;}t._bIsColumnResizerMoving=true;t.$().toggleClass("sapUiTableResizing",true);var d=q(document),c=t._isTouchMode(e);t._$colResize=t.$("rsz");t._iColumnResizeStart=C._getX(e,t);d.bind((c?"touchend":"mouseup")+".sapUiTableColumnResize",C.exitColumnResizing.bind(t));d.bind((c?"touchmove":"mousemove")+".sapUiTableColumnResize",C.onMouseMoveWhileColumnResizing.bind(t));t._disableTextSelection();},exitColumnResizing:function(e){C._resizeColumn(this,this._iLastHoveredColumnIndex);},onMouseMoveWhileColumnResizing:function(e){var l=C._getX(e,this);if(this._iColumnResizeStart&&l<this._iColumnResizeStart+3&&l>this._iColumnResizeStart-3){return;}if(this._isTouchMode(e)){e.stopPropagation();e.preventDefault();}this._$colResize.toggleClass("sapUiTableColRszActive",true);var c=this._getVisibleColumns()[this._iLastHoveredColumnIndex];var d=l-this._iColumnResizeStart;var w=Math.max(c.$().width()+d*(this._bRtlMode?-1:1),this._iColMinWidth);var r=this.$().find(".sapUiTableCnt").offset().left;var R=Math.floor((l-r)-(this._$colResize.width()/2));this._$colResize.css("left",R+"px");c._iNewWidth=w;},_cleanupColumResizing:function(t){if(t._$colResize){t._$colResize.toggleClass("sapUiTableColRszActive",false);t._$colResize=null;}t._iColumnResizeStart=null;t._bIsColumnResizerMoving=false;t.$().toggleClass("sapUiTableResizing",false);t._enableTextSelection();var d=q(document);d.unbind("touchmove.sapUiTableColumnResize");d.unbind("touchend.sapUiTableColumnResize");d.unbind("mousemove.sapUiTableColumnResize");d.unbind("mouseup.sapUiTableColumnResize");},_resizeColumn:function(t,c){var v=t._getVisibleColumns(),o,r=false;if(c>=0&&c<v.length){o=v[c];if(o._iNewWidth){var w;var A=t.$().find(".sapUiTableCtrl").width();if(!t._checkPercentageColumnWidth()){w=o._iNewWidth+"px";}else{var i=Math.round(100/A*o._iNewWidth);w=i+"%";}if(t._updateColumnWidth(o,w,true)){t._resizeDependentColumns(o,w);}delete o._iNewWidth;r=true;}}C._cleanupColumResizing(t);o.focus();if(r){t.invalidate();}},_getX:function(e,t){if(t._isTouchMode(e)){return e.targetTouches?e.targetTouches[0].pageX:e.originalEvent.targetTouches[0].pageX;}else{return e.pageX;}},doAutoResizeColumn:function(t,c){var v=t._getVisibleColumns(),o;if(c>=0&&c<v.length){o=v[c];if(!o.getAutoResizable()||!o.getResizable()){return;}var n=C._calculateAutomaticColumnWidth.apply(t,[o,c]);if(n){o._iNewWidth=n;C._resizeColumn(t,c);}}},_calculateAutomaticColumnWidth:function(c,d){function e(p){var t=["sap/m/Text","sap/m/Label","sap/m/Link","sap/m/Input","sap/ui/commons/TextView","sap/ui/commons/Label","sap/ui/commons/Link","sap/ui/commons/TextField"];var j=false;for(var i=0;i<t.length;i++){j=j||a.isInstanceOf(p,t[i]);}if(!j&&typeof b._fnCheckTextBasedControl==="function"&&b._fnCheckTextBasedControl(p)){j=true;}return j;}var $=this.$();var h=0;var f=$.find('td[headers=\"'+this.getId()+'_col'+d+'\"]').children("div");var H=c.getHeaderSpan();var o=c.getLabel();var g=c.getTemplate();var j=e(g);var k=document.createElement("div");document.body.appendChild(k);q(k).addClass("sapUiTableHiddenSizeDetector");var l=c.getMultiLabels();if(l.length==0&&!!o){l=[o];}if(l.length>0){q.each(l,function(p,L){var r;if(!!L.getText()){q(k).text(L.getText());h=k.scrollWidth;}else{h=L.$().scrollWidth;}h=h+$.find("#"+c.getId()+"-icons").first().width();$.find(".sapUiTableColIcons#"+c.getId()+"_"+p+"-icons").first().width();if(H instanceof Array&&H[p]>1){r=H[p];}else if(H>1){r=H;}if(!!r){var i=r-1;while(i>d){h=h-(this._getVisibleColumns()[d+i].$().width()||0);i-=1;}}});}var m=Math.max.apply(null,f.map(function(){var _=q(this);return parseInt(_.css('padding-left'),10)+parseInt(_.css('padding-right'),10)+parseInt(_.css('margin-left'),10)+parseInt(_.css('margin-right'),10);}).get());var n=Math.max.apply(null,f.children().map(function(){var w=0,W=0;var _=q(this);var s=_.text()||_.val();if(j){q(k).text(s);W=k.scrollWidth;}else{W=this.scrollWidth;}if(h>W){W=h;}w=W+parseInt(_.css('margin-left'),10)+parseInt(_.css('margin-right'),10)+m+1;return w;}).get());q(k).remove();return Math.max(n,this._iColMinWidth);},initColumnTracking:function(t){t.$().find(".sapUiTableCtrlScr, .sapUiTableCtrlScrFixed, .sapUiTableColHdrScr, .sapUiTableColHdrFixed").mousemove(function(e){var d=this.getDomRef();if(!d||this._bIsColumnResizerMoving){return;}var p=e.clientX,c=d.getBoundingClientRect(),l=0,r=this._bRtlMode?10000:-10000;for(var i=0;i<this._aTableHeaders.length;i++){var o=this._aTableHeaders[i].getBoundingClientRect();if(this._bRtlMode){if(p<o.right-5){l=i;r=o.left-c.left;}}else{if(p>o.left+5){l=i;r=o.right-c.left;}}}var f=this._getVisibleColumns()[l];if(f&&f.getResizable()){this.$("rsz").css("left",r+"px");this._iLastHoveredColumnIndex=l;}}.bind(t));}};var I={initInteractiveResizing:function(t,e){var B=q(document.body),s=t.$("sb"),d=q(document),o=s.offset(),h=s.height(),w=s.width(),c=t._isTouchMode(e);B.bind("selectstart",I.onSelectStartWhileInteractiveResizing);B.append("<div id=\""+t.getId()+"-ghost\" class=\"sapUiTableInteractiveResizerGhost\" style =\" height:"+h+"px; width:"+w+"px; left:"+o.left+"px; top:"+o.top+"px\" ></div>");s.append("<div id=\""+t.getId()+"-rzoverlay\" style =\"left: 0px; right: 0px; bottom: 0px; top: 0px; position:absolute\" ></div>");d.bind((c?"touchend":"mouseup")+".sapUiTableInteractiveResize",I.exitInteractiveResizing.bind(t));d.bind((c?"touchmove":"mousemove")+".sapUiTableInteractiveResize",I.onMouseMoveWhileInteractiveResizing.bind(t));t._disableTextSelection();},exitInteractiveResizing:function(e){var B=q(document.body),d=q(document),t=this.$(),g=this.$("ghost"),l=I._getY(e,this);var n=l-t.find(".sapUiTableCCnt").offset().top-g.height()-t.find(".sapUiTableFtr").height();this._setRowContentHeight(n);this._adjustRows(this._calculateRowsToDisplay(n));g.remove();this.$("rzoverlay").remove();B.unbind("selectstart",I.onSelectStartWhileInteractiveResizing);d.unbind("touchend.sapUiTableInteractiveResize");d.unbind("touchmove.sapUiTableInteractiveResize");d.unbind("mouseup.sapUiTableInteractiveResize");d.unbind("mousemove.sapUiTableInteractiveResize");this._enableTextSelection();},onSelectStartWhileInteractiveResizing:function(e){e.preventDefault();e.stopPropagation();return false;},onMouseMoveWhileInteractiveResizing:function(e){var l=I._getY(e,this);var m=this.$().offset().top;if(l>m){this.$("ghost").css("top",l+"px");}},_getY:function(e,t){if(t._isTouchMode(e)){return e.targetTouches?e.targetTouches[0].pageY:e.originalEvent.targetTouches[0].pageY;}else{return e.pageY;}}};var E={onmousedown:function(e){this._getKeyboardExtension().initItemNavigation();if(e.button===0){if(e.target===this.getDomRef("sb")){I.initInteractiveResizing(this,e);}else if(e.target===this.getDomRef("rsz")){C.initColumnResizing(this,e);}else if(q(e.target).hasClass("sapUiTableColResizer")){var c=q(e.target).closest(".sapUiTableCol").attr("data-sap-ui-colindex");this._iLastHoveredColumnIndex=parseInt(c,10);C.initColumnResizing(this,e);}}},onmouseup:function(e){q.sap.clearDelayedCall(this._mTimeouts.delayedActionTimer);},ondblclick:function(e){if(D.system.desktop&&e.target===this.getDomRef("rsz")){e.preventDefault();C.doAutoResizeColumn(this,this._iLastHoveredColumnIndex);}},onclick:function(e){q.sap.clearDelayedCall(this._mTimeouts.delayedActionTimer);if(e.isMarked()){return;}var t=q(e.target);if(t.hasClass("sapUiAnalyticalTableSum")){e.preventDefault();return;}else if(t.hasClass("sapUiTableGroupMenuButton")){this._onContextMenu(e);e.preventDefault();return;}else if(t.hasClass("sapUiTableGroupIcon")||t.hasClass("sapUiTableTreeIcon")){if(a.toggleGroupHeader(this,e.target)){return;}}if(!this._findAndfireCellEvent(this.fireCellClick,e)){this._onSelect(e);}else{e.preventDefault();}}};var b=T.extend("sap.ui.table.TablePointerExtension",{_init:function(t,s,S){this._type=s;this._delegate=E;t.addEventDelegate(this._delegate,t);t._iLastHoveredColumnIndex=0;t._bIsColumnResizerMoving=false;return"PointerExtension";},destroy:function(){var t=this.getTable();if(t){t.removeEventDelegate(this._delegate);}this._delegate=null;T.prototype.destroy.apply(this,arguments);},doAutoResizeColumn:function(c){var t=this.getTable();if(t){C.doAutoResizeColumn(t,c);}},initColumnResizeEvents:function(){var t=this.getTable();if(t){C.initColumnTracking(t);}},cleanupColumnResizeEvents:function(){var t=this.getTable();if(t){t.$().find(".sapUiTableCtrlScr, .sapUiTableCtrlScrFixed, .sapUiTableColHdrScr, .sapUiTableColHdrFixed").unbind();}}});return b;},true);
