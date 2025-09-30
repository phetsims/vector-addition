// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DSceneNode displays a scene for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Explore1DVectorCreatorPanel from './Explore1DVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Explore1DScene from '../model/Explore1DScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Explore2DScene from '../../explore2D/model/Explore2DScene.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';

export default class Explore1DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: Explore1DScene,
                      sceneProperty: TReadOnlyProperty<Explore2DScene>,
                      viewProperties: Explore1DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sumVisibleProperty ], viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Add the vector creator panel
    this.addVectorToolbox( new Explore1DVectorCreatorPanel( scene, this, {
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_CREATOR_PANEL,
      tandem: tandem.createTandem( 'vectorToolbox' )
    } ) );
  }
}

vectorAddition.register( 'Explore1DSceneNode', Explore1DSceneNode );