/**
 * @projectDescription	Event controller for CRC's Query Tool.
 * @inherits 	i2b2.CRC.ctrlr
 * @namespace	i2b2.CRC.ctrlr.QT
 * @author		Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 *
 * ----------------------------------------------------------------------------------------
 * updated 9-15-08: RC4 launch [Nick Benik] 
 * excerpted 2014-11-21 for use in PortQuery plug-in [Dan Connolly]
 */

(function(exports) {
	exports.doQueryLoadCallback = function(results) {
			// THIS function is used to process the AJAX results of the getChild call
			//		results data object contains the following attributes:
			//			refXML: xmlDomObject <--- for data processing
			//			msgRequest: xml (string)
			//			msgResponse: xml (string)
			//			error: boolean
			//			errorStatus: string [only with error=true]
			//			errorMsg: string [only with error=true]
			i2b2.CRC.view.QT.queryRequest = results.msgRequest;
			i2b2.CRC.view.QT.queryResponse = results.msgResponse;
			// switch to status tab
			i2b2.CRC.view.status.showDisplay();
			// did we get a valid query definition back? 
			var qd = i2b2.h.XPath(results.refXML, 'descendant::query_name/..');
			if (qd.length != 0) {
				i2b2.CRC.ctrlr.QT.doQueryClear();
				var dObj = {};
				dObj.name = i2b2.h.getXNodeVal(results.refXML,'name');
					$('queryName').innerHTML = dObj.name;
				dObj.timing = i2b2.h.getXNodeVal(qd[0],'query_timing');
				//i2b2.CRC.view.QT.queryTimingButtonset("label", dObj.timing);
				i2b2.CRC.view.QT.setQueryTiming(dObj.timing);
				dObj.specificity = i2b2.h.getXNodeVal(qd[0],'specificity_scale');
				//dObj.panels = new Array(new Array());
	
				var sqc = i2b2.h.XPath(qd[0], 'subquery_constraint');
			
				for (var j=0; j <sqc.length; j++) {

					i2b2.CRC.view.QT.setQueryTiming("TEMPORAL");
					//i2b2.CRC.view.QT.setQueryTiming("BUILDER");
				
					 $('instancevent1['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'first_query/query_id');
					 $('preloc1['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'first_query/join_column');
					 $('instanceopf1['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'first_query/aggregate_operator');
					$('postloc['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'operator');
					$('instancevent2['+j + ']').value =i2b2.h.getXNodeVal(sqc[j],'second_query/query_id');
					$('preloc2['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'second_query/join_column');
					$('instanceopf2['+j + ']').value = i2b2.h.getXNodeVal(sqc[j],'second_query/aggregate_operator');


					var span = i2b2.h.XPath(sqc[j], 'span');

					for (var k=0; k < span.length; k++) {
						$('byspan' + k + '[' +j + ']').value = i2b2.h.getXNodeVal(span[k],'operator');
						$('bytimevalue' + k + '[' +j + ']').value = i2b2.h.getXNodeVal(span[k],'span_value');
						$('bytimeunit' + k + '[' +j + ']').value = i2b2.h.getXNodeVal(span[k],'units');
					}
				}
				
				
				for (var j=0; j <qd.length; j++) {
					dObj.panels = [];
					if (j==0)
						var qp = i2b2.h.XPath(qd[j], 'panel');
					else
						var qp = i2b2.h.XPath(qd[j], 'descendant::panel');
					
					var total_panels = qp.length;
					for (var i1=0; i1<total_panels; i1++) {
						i2b2.CRC.ctrlr.QT.temporalGroup = j;
						i2b2.CRC.ctrlr.QT._redrawAllPanels();
						
						// extract the data for each panel
						var po = {};
						po.panel_num = i2b2.h.getXNodeVal(qp[i1],'panel_number');
						var t = i2b2.h.getXNodeVal(qp[i1],'invert');
						po.exclude = (t=="1");
						//po.timing = i2b2.h.getXNodeVal(qp[i1],'panel_timing');				
						// 1.4 queries don't have panel_timing, and undefined doesn't work
						// so default to ANY
						po.timing = i2b2.h.getXNodeVal(qp[i1],'panel_timing') || 'ANY';			
						i2b2.CRC.view.QT.setPanelTiming(po.panel_num, po.timing);
						var t = i2b2.h.getXNodeVal(qp[i1],'total_item_occurrences');
						po.occurs = (t|0)-1;
						var t = i2b2.h.getXNodeVal(qp[i1],'panel_accuracy_scale');
						po.relevance = t;					
						var t = i2b2.h.getXNodeVal(qp[i1],'panel_date_from');
						if (t) {
						//	t = t.replace('T','-');
						//	t = t.replace('Z','-');
						//	t = t.split('-');
							// new Date(start_date.substring(0,4), start_date.substring(5,7)-1, start_date.substring(8,10), start_date.substring(11,13), start_date.substring(14,16),start_date.substring(17,19),start_date.substring(20,23));
							po.dateFrom = {};
							po.dateFrom.Year = t.substring(0,4); //t[0];
							po.dateFrom.Month = t.substring(5,7); //t[1];
							po.dateFrom.Day = t.substring(8,10); //t[2];
						} else {
							po.dateFrom = false;
						}
						var t = i2b2.h.getXNodeVal(qp[i1],'panel_date_to');
						if (t) {
							//t = t.replace('T','-');
							//t = t.replace('Z','-');
							//t = t.split('-');
							po.dateTo = {};
							po.dateTo.Year =  t.substring(0,4); //t[0];
							po.dateTo.Month =  t.substring(5,7); // t[1];
							po.dateTo.Day = t.substring(8,10);// t[2];
						} else {
							po.dateTo = false;
						}
						po.items = [];
						var pi = i2b2.h.XPath(qp[i1], 'descendant::item[item_key]');
						for (var i2=0; i2<pi.length; i2++) {
							var item = {};
							// get the item's details from the ONT Cell
							var ckey = i2b2.h.getXNodeVal(pi[i2],'item_key');
							
							
							// Determine what item this is
							if (ckey.startsWith("query_master_id")) {
								var o = new Object;
								o.name =i2b2.h.getXNodeVal(pi[i2],'item_name');
								o.id = ckey.substring(16);
								o.result_instance_id = o.PRS_id ;
	
								var sdxDataNode = i2b2.sdx.Master.EncapsulateData('QM',o);
								po.items.push(sdxDataNode);								
							} else 	if (ckey.startsWith("masterid")) {
								var o = new Object;
								o.name =i2b2.h.getXNodeVal(pi[i2],'item_name');
								o.id = ckey;
								o.result_instance_id = o.PRS_id ;
	
								var sdxDataNode = i2b2.sdx.Master.EncapsulateData('QM',o);
								po.items.push(sdxDataNode);								
							} else if (ckey.startsWith("patient_set_coll_id")) {
								var o = new Object;
								o.titleCRC =i2b2.h.getXNodeVal(pi[i2],'item_name');
								o.PRS_id = ckey.substring(20);
								o.result_instance_id = o.PRS_id ;
	
								var sdxDataNode = i2b2.sdx.Master.EncapsulateData('PRS',o);
								po.items.push(sdxDataNode);		
							} else if (ckey.startsWith("patient_set_enc_id")) {
								var o = new Object;
								o.titleCRC =i2b2.h.getXNodeVal(pi[i2],'item_name');
								o.PRS_id = ckey.substring(19);
								o.result_instance_id = o.PRS_id ;
	
								var sdxDataNode = i2b2.sdx.Master.EncapsulateData('ENS',o);
								po.items.push(sdxDataNode);		
									
							} else {
								//Get the modfier if it exists
						//		if (i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier') != null)
						//		{
						//			po.modifier_key = i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier/modifier_key');
						//			po.applied_path = i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier/applied_path');
						//		}
								
								
								// WE MUST QUERY THE ONT CELL TO BE ABLE TO DISPLAY THE TREE STRUCTURE CORRECTLY
	
									var o = new Object;
									o.level = i2b2.h.getXNodeVal(pi[i2],'hlevel');
									o.name = i2b2.h.getXNodeVal(pi[i2],'item_name');
									o.key = i2b2.h.getXNodeVal(pi[i2],'item_key');
									o.synonym_cd = i2b2.h.getXNodeVal(pi[i2],'item_is_synonym');
									o.tooltip = i2b2.h.getXNodeVal(pi[i2],'tooltip');
									o.hasChildren = i2b2.h.getXNodeVal(pi[i2],'item_icon');
									
									//o.xmlOrig = c;
									
									// Lab Values processing
									var lvd = i2b2.h.XPath(pi[i2], 'descendant::constrain_by_value');
									if ((lvd.length>0) && (i2b2.h.XPath(pi[i2], 'descendant::constrain_by_modifier').length == 0)){
										lvd = lvd[0];
										// pull the LabValue definition for concept
										// extract & translate
										var t = i2b2.h.getXNodeVal(lvd,"value_constraint");
										o.LabValues = {};
										o.LabValues.NumericOp = i2b2.h.getXNodeVal(lvd,"value_operator");
										o.LabValues.GeneralValueType = i2b2.h.getXNodeVal(lvd,"value_type");								
										switch(o.LabValues.GeneralValueType) {
											case "NUMBER":
												o.LabValues.MatchBy = "VALUE";
												if (t.indexOf(' and ')!=-1) {
													// extract high and low values
													t = t.split(' and ');
													o.LabValues.ValueLow = t[0];
													o.LabValues.ValueHigh = t[1];
												} else {
													o.LabValues.Value = t;
												}
												break;
											case "STRING":
												o.LabValues.MatchBy = "VALUE";
												o.LabValues.ValueString = t;
												break;
											case "LARGETEXT":
												o.LabValues.MatchBy = "VALUE";
												o.LabValues.GeneralValueType = "LARGESTRING";
												o.LabValues.DbOp = (i2b2.h.getXNodeVal(lvd,"value_operator") == "CONTAINS[database]" ? true : false );													
												o.LabValues.ValueString = t;
												break;
											case "TEXT":	// this means Enum?
												o.LabValues.MatchBy = "VALUE";
												try {
													o.LabValues.ValueEnum = eval("(Array"+t+")");
													o.LabValues.GeneralValueType = "ENUM";																									
												} catch(e) {
													//is a string
													o.LabValues.StringOp = i2b2.h.getXNodeVal(lvd,"value_operator");
													o.LabValues.ValueString = t;
													o.LabValues.GeneralValueType = "STRING";	
													//i2b2.h.LoadingMask.hide();
													//("Conversion Failed: Lab Value data = "+t);
												}
												break;
											case "FLAG":
												o.LabValues.MatchBy = "FLAG";
												o.LabValues.ValueFlag = t
												break;		
											default:
												o.LabValues.Value = t;
										}		
									}
									// sdx encapsulate
									var sdxDataNode = i2b2.sdx.Master.EncapsulateData('CONCPT',o);
									if (o.LabValues) {
										// We do want 2 copies of the Lab Values: one is original from server while the other one is for user manipulation
										sdxDataNode.LabValues = o.LabValues;
									}
											//o.xmlOrig = c;
											if (i2b2.h.XPath(pi[i2], 'descendant::constrain_by_modifier').length > 0) {
										//if (i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier') != null) {
											sdxDataNode.origData.parent = {};
											sdxDataNode.origData.parent.key = o.key;
											//sdxDataNode.origData.parent.LabValues = o.LabValues;
											sdxDataNode.origData.parent.hasChildren = o.hasChildren;
											sdxDataNode.origData.parent.level = o.level;
											sdxDataNode.origData.parent.name = o.name;
											sdxDataNode.origData.key = i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier/modifier_key');
											sdxDataNode.origData.applied_path = i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier/applied_path');
											sdxDataNode.origData.name = i2b2.h.getXNodeVal(pi[i2],'constrain_by_modifier/modifier_name');
											sdxDataNode.origData.isModifier = true;
											this.hasModifier = true;
											
											// Lab Values processing
											var lvd = i2b2.h.XPath(pi[i2], 'descendant::constrain_by_modifier/constrain_by_value');
											if (lvd.length>0){
												lvd = lvd[0];
												// pull the LabValue definition for concept
	
												// extract & translate
												var t = i2b2.h.getXNodeVal(lvd,"value_constraint");
												o.ModValues = {};
												o.ModValues.NumericOp = i2b2.h.getXNodeVal(lvd,"value_operator");
												o.ModValues.GeneralValueType = i2b2.h.getXNodeVal(lvd,"value_type");								
												switch(o.ModValues.GeneralValueType) {
													case "NUMBER":
														o.ModValues.MatchBy = "VALUE";
														if (t.indexOf(' and ')!=-1) {
															// extract high and low values
															t = t.split(' and ');
															o.ModValues.ValueLow = t[0];
															o.ModValues.ValueHigh = t[1];
														} else {
															o.ModValues.Value = t;
														}
														break;
													case "STRING":
														o.ModValues.MatchBy = "VALUE";
														o.ModValues.ValueString = t;
														break;
													case "LARGETEXT":
														o.ModValues.MatchBy = "VALUE";
														o.ModValues.GeneralValueType = "LARGESTRING";
														o.ModValues.DbOp = (i2b2.h.getXNodeVal(lvd,"value_operator") == "CONTAINS[database]" ? true : false );													
														o.ModValues.ValueString = t;
														break;
													case "TEXT":	// this means Enum?
														o.ModValues.MatchBy = "VALUE";
														try {
															o.ModValues.ValueEnum = eval("(Array"+t+")");
															o.ModValues.GeneralValueType = "ENUM";													
														} catch(e) {
															o.ModValues.StringOp = i2b2.h.getXNodeVal(lvd,"value_operator");
															o.ModValues.ValueString = t;
															
														//	i2b2.h.LoadingMask.hide();
														//	console.error("Conversion Failed: Lab Value data = "+t);
														}
														break;
													case "FLAG":
														o.ModValues.MatchBy = "FLAG";
														o.ModValues.ValueFlag = t
														break;		
													default:
														o.ModValues.Value = t;
												}		
											}
											// sdx encapsulate
											//var sdxDataNode = i2b2.sdx.Master.EncapsulateData('CONCPT',o);
											if (o.ModValues) {
												// We do want 2 copies of the Lab Values: one is original from server while the other one is for user manipulation
												sdxDataNode.ModValues = o.ModValues;
											}
										//}
												
									}
									
									
									po.items.push(sdxDataNode);
							//	} else {
							//		console.error("CRC's ONT Handler could not get term details about '"+ckey+"'!");
							//	}
								
							}
						}
						dObj.panels[po.panel_num] = po;
					}
					// reindex the panels index (panel [1,3,5] should be [0,1,2])
					dObj.panels = dObj.panels.compact();
					i2b2.CRC.model.queryCurrent.panels[j] = dObj.panels;
				
				}
				// populate the panels yuiTrees
				try {
					var qpc = i2b2.CRC.ctrlr.QT.panelControllers[0];
					var dm = i2b2.CRC.model.queryCurrent;
					for (var k=0; k<dm.panels.length; k++) {
					for (var pi=0; pi<dm.panels[k].length; pi++) {
						// create a treeview root node and connect it to the treeview controller
						dm.panels[k][pi].tvRootNode = new YAHOO.widget.RootNode(qpc.yuiTree);
						qpc.yuiTree.root = dm.panels[k][pi].tvRootNode;
						dm.panels[k][pi].tvRootNode.tree = qpc.yuiTree;
						qpc.yuiTree.setDynamicLoad(i2b2.CRC.ctrlr.QT._loadTreeDataForNode,1);						
						// load the treeview with the data
						var tvRoot = qpc.yuiTree.getRoot();
						for (var pii=0; pii<dm.panels[k][pi].items.length; pii++) {
							var withRenderData = qpc._addConceptVisuals(dm.panels[k][pi].items[pii], tvRoot, false);
							if (dm.panels[k][pi].items[pii].ModValues)
							{
								withRenderData.ModValues = 	dm.panels[k][pi].items[pii].ModValues;
							}
							if (dm.panels[k][pi].items[pii].LabValues)
							{
								withRenderData.LabValues = 	dm.panels[k][pi].items[pii].LabValues;
							}
							
							dm.panels[k][pi].items[pii] = withRenderData;
						}
					}
					}
				} catch (e) {}
				// redraw the Query Tool GUI
				i2b2.CRC.ctrlr.QT._redrawPanelCount();
				i2b2.CRC.ctrlr.QT.doScrollFirst();
				// hide the loading mask
				i2b2.h.LoadingMask.hide();
				}
				i2b2.CRC.ctrlr.QT.temporalGroup = 0;
				i2b2.CRC.ctrlr.QT._redrawAllPanels();
		};

}(window));
