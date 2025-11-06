// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DSceneNode displays a scene for the 'Explore 1D' screen.
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
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';

export default class Explore1DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: ExploreScene,
                      sceneProperty: TReadOnlyProperty<ExploreScene>,
                      viewProperties: Explore1DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sumVisibleProperty ], viewProperties, componentVectorStyleProperty, {

      // This screen has a vector toolbox.
      createVectorToolbox: sceneNode => new ExploreVectorToolbox( scene, sceneNode, {
        iconModelComponents: ( scene.graph.orientation === 'horizontal' ) ? new Vector2( 2.5, 0 ) : new Vector2( 0, 2.5 ),
        ySpacing: ( scene.graph.orientation === 'horizontal' ) ? 32 : 18,
        left: sceneRadioButtonGroup.left,
        bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_TOOLBOX,
        tandem: tandem.createTandem( 'vectorToolbox' )
      } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'Explore1DSceneNode', Explore1DSceneNode );