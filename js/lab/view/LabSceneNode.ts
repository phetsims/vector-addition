// Copyright 2025, University of Colorado Boulder

/**
 * LabSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import LabVectorToolbox from './LabVectorToolbox.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import LabScene from '../model/LabScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import LabViewProperties from './LabViewProperties.js';

export default class LabSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: LabScene,
                      sceneProperty: TReadOnlyProperty<LabScene>,
                      viewProperties: LabViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sum1VisibleProperty, viewProperties.sum2VisibleProperty ], viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Add the vector toolbox.
    this.addVectorCreatorPanel( new LabVectorToolbox( scene, this, {
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_CREATOR_PANEL,
      tandem: tandem.createTandem( 'vectorToolbox' )
    } ) );
  }
}

vectorAddition.register( 'LabSceneNode', LabSceneNode );