// Copyright 2025, University of Colorado Boulder

/**
 * LabSceneNode displays a scene for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import LabVectorToolbox from './LabVectorToolbox.js';
import LabViewProperties from './LabViewProperties.js';

export default class LabSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: LabScene,
                      sceneProperty: TReadOnlyProperty<LabScene>,
                      viewProperties: LabViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sum1VisibleProperty, viewProperties.sum2VisibleProperty ], viewProperties, componentVectorStyleProperty, {

      // This screen has a vector toolbox.
      createVectorToolbox: sceneNode => new LabVectorToolbox( sceneNode, scene.vectorSet1, scene.vectorSet2,
        scene.graph.modelViewTransformProperty, scene.graph.boundsProperty, {
          left: sceneRadioButtonGroup.left,
          bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_TOOLBOX,
          tandem: tandem.createTandem( 'vectorToolbox' )
        } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'LabSceneNode', LabSceneNode );