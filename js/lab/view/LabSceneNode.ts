// Copyright 2025, University of Colorado Boulder

/**
 * LabSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import LabVectorCreatorPanel from './LabVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import LabScene from '../model/LabScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';

export default class LabSceneNode extends SceneNode {

  public constructor( scene: LabScene,
                      sceneProperty: TReadOnlyProperty<LabScene>,
                      viewProperties: VectorAdditionViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Add the vector creator panel
    this.addVectorCreatorPanel( new LabVectorCreatorPanel( scene, this, {
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'LabSceneNode', LabSceneNode );