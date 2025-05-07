// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DSceneNode displays a scene for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Explore1DVectorCreatorPanel from './Explore1DVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Explore1DScene from '../model/Explore1DScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Explore2DScene from '../../explore2D/model/Explore2DScene.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';

export default class Explore1DSceneNode extends SceneNode {

  public constructor( scene: Explore1DScene,
                      sceneProperty: TReadOnlyProperty<Explore2DScene>,
                      viewProperties: VectorAdditionViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Vector symbols depend on graph orientation
    const vectorSymbolProperties = ( scene.graph.orientation === 'horizontal' ) ?
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

    // Add the vector creator panel
    this.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( scene, this, vectorSymbolProperties, {
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'Explore1DSceneNode', Explore1DSceneNode );