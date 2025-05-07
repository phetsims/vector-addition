// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Explore2DVectorCreatorPanel from './Explore2DVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Explore2DScene from '../model/Explore2DScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';

export default class Explore2DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: Explore2DScene,
                      sceneProperty: TReadOnlyProperty<Explore2DScene>,
                      viewProperties: VectorAdditionViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Vector symbols depend on whether snap mode is Cartesian or polar.
    const vectorSymbolProperties = ( scene.coordinateSnapMode === 'cartesian' ) ?
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                   VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

    // Add the vector creator panel
    this.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( scene, this, vectorSymbolProperties, {
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'Explore2DSceneNode', Explore2DSceneNode );