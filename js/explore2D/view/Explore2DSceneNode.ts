// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneNode from '../../common/view/SceneNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Explore2DVectorCreatorPanel from './Explore2DVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Explore2DViewProperties from './Explore2DViewProperties.js';
import Explore2DGraph from '../model/Explore2DGraph.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';

export default class Explore2DSceneNode extends SceneNode {

  public constructor( graph: Explore2DGraph,
                      viewProperties: Explore2DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphOrientationRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( graph, viewProperties, componentVectorStyleProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ],
        graphOrientation => graphOrientation === graph.coordinateSnapMode ),
      tandem: tandem
    } );

    // Vector symbols depend on whether snap mode is Cartesian or polar.
    const vectorSymbolProperties = ( graph.coordinateSnapMode === 'cartesian' ) ?
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

    // Add the vector creator panel
    this.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( graph, this, vectorSymbolProperties, {
      left: graphOrientationRadioButtonGroup.left,
      bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'Explore2DSceneNode', Explore2DSceneNode );