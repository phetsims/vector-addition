// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Explore2DViewProperties from './Explore2DViewProperties.js';
import ExploreVectorToolbox from '../../common/view/ExploreVectorToolbox.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ExploreScene from '../../common/model/ExploreScene.js';

export default class Explore2DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: ExploreScene,
                      sceneProperty: TReadOnlyProperty<ExploreScene>,
                      viewProperties: Explore2DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sumVisibleProperty ], viewProperties, componentVectorStyleProperty, {

      // This screen has a vector toolbox.
      createVectorToolbox: sceneNode => new ExploreVectorToolbox( scene, sceneNode, {
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