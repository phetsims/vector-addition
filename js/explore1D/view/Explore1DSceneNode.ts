// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DSceneNode displays a scene for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import ExploreVectorToolbox from '../../common/view/ExploreVectorToolbox.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class Explore1DSceneNode extends VectorAdditionSceneNode {

  public constructor( scene: ExploreScene,
                      sceneProperty: TReadOnlyProperty<ExploreScene>,
                      viewProperties: Explore1DViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sceneRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( scene, sceneProperty, [ viewProperties.sumVisibleProperty ], viewProperties, componentVectorStyleProperty, {
      tandem: tandem
    } );

    // Add the vector toolbox.
    this.addVectorToolbox( new ExploreVectorToolbox( scene, this, {
      iconVectorComponents: ( scene.graph.orientation === 'horizontal' ) ? new Vector2( 0, 1 ) : new Vector2( 1, 0 ),
      ySpacing: ( scene.graph.orientation === 'horizontal' ) ? 32 : 18,
      left: sceneRadioButtonGroup.left,
      bottom: sceneRadioButtonGroup.top - VectorAdditionConstants.SPACE_BELOW_VECTOR_TOOLBOX,
      tandem: tandem.createTandem( 'vectorToolbox' )
    } ) );

    // After PhET-iO state has been restored, register all active vectors to build their view.
    //TODO https://github.com/phetsims/vector-addition/issues/258 Duplicated in Explore2DSceneNode and LabSceneNode.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => {
        scene.vectorSet.activeVectors.forEach( activeVector => this.registerVector( activeVector, scene.vectorSet ) );
      } );
    }
  }
}

vectorAddition.register( 'Explore1DSceneNode', Explore1DSceneNode );