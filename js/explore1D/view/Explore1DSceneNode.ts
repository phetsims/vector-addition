// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DSceneNode displays a scene for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneNode from '../../common/view/SceneNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Explore1DVectorCreatorPanel from './Explore1DVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Explore1DGraph from '../model/Explore1DGraph.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class Explore1DSceneNode extends SceneNode {

  public constructor( graph: Explore1DGraph,
                      viewProperties: Explore1DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphOrientationRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( graph, viewProperties, componentVectorStyleProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.graphOrientationProperty ],
        graphOrientation => graphOrientation === graph.orientation ),
      tandem: tandem
    } );

    // Vector symbols depend on graph orientation
    const vectorSymbolProperties = ( graph.orientation === 'horizontal' ) ?
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

    // Add the vector creator panel
    this.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( graph, this, vectorSymbolProperties, {
      left: graphOrientationRadioButtonGroup.left,
      bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'Explore1DSceneNode', Explore1DSceneNode );