// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import ExploreVectorToolbox from '../../common/view/ExploreVectorToolbox.js';
import ExploreViewProperties from '../../common/view/ExploreViewProperties.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import vectorAddition from '../../vectorAddition.js';

export default class Explore2DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: ExploreScene,
                      sceneProperty: TReadOnlyProperty<ExploreScene>,
                      viewProperties: ExploreViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sumVisibleProperty ], viewProperties, componentVectorStyleProperty, {

      // This screen has a vector toolbox.
      createVectorToolbox: sceneNode => new ExploreVectorToolbox( sceneNode, scene.vectorSet,
        scene.graph.modelViewTransformProperty, scene.graph.boundsProperty, scene.graph.orientation, {
          iconModelComponents: new Vector2( 1.75, 1.75 ),
          left: sceneRadioButtonGroup.left,
          bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_TOOLBOX,
          tandem: tandem.createTandem( 'vectorToolbox' )
        } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'Explore2DSceneNode', Explore2DSceneNode );