/**
 *  Load the Open Harmony Library as needed.
 */
function oh_load(){
  try{
    //If an override debug path exists, use it.
    var oh_incl = preferences.getString( 'openHarmonyIncludeDebug', false );
    if( oh_incl ){
      oh_incl = preferences.getString( 'openHarmonyInclude', false );
    }
  
    if( !this["$"] ){  
      include( oh_incl );
    }
    if( !this["$"] ){  
      MessageBox.warning( "Unable to load the openHarmony library. Is it installed?" );
    }
  }catch(err){
    System.println( err + " : " + err.lineNumber + " " + err.fileName );
  }
}

/**
 *  Adds a peg with a pivot at the center of the selected drawings module(s).
 */
function oh_rigging_addCenterWeightedPeg(){
  scene.beginUndoRedoAccum( "oh_rigging_addCenterWeightedPeg" );
  oh_load();
  
  //Work only on SELECTED READ modules.
  var nodes = $.scene.nodeSearch( "#READ(SELECTED)" );
  
  for( var n=0;n<nodes.length;n++ ){
    
    //Get a curve representation of the drawing.
    var curves = nodes[n].getCountourCurves( 250 );
    var avg = new oPoint( 0.0, 0.0, 0.0 );
    var cnt = 0;
    
    //Get the average of the curve end points.
    for( var x=0;x<curves.length;x++ ){
      avg.pointAdd( curves[x][0] );
      cnt+=1;

      if( x==curves.length-1 ){
        avg.pointAdd( curves[x][3] );
        cnt+=1;
      }
    }
    
    //The average of all the points.
    avg.divide( cnt );
    
    //Get the in node of the drawing.
    var innode  = nodes[n].ins[0];
    
    //Create the node, increment if the name already exists.
    var res = $.scene.addNode( "PEG", nodes[n].name+"-P", nodes[n].parent, new oPoint(0.0, 0.0, 0.0), true );
    res.pivot = avg;
    
    res.centerAbove( [nodes[n]], 0.0, -50.0 );
    if( innode ){ 
      res.y = ((innode.y - nodes[n].y)*0.25) + nodes[n].y;
    }
    
    //Insert it in, add it between the existing modules if necessary.
    nodes[n].insertInNode( 0, res, 0, 0 );
  }
  
  scene.endUndoRedoAccum( );
}