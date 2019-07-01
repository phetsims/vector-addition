// Copyright 2019, University of Colorado Boulder

/**
 * Screen view for the sim.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  class VectorAdditionScreenView extends ScreenView {
    /**
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {array.<SceneNode} sceneNodes
     * @param {Tandem} tandem
     */
    constructor( vectorAdditionModel, sceneNodes, tandem ) {

      assert && assert( vectorAdditionModel instanceof VectorAdditionModel,
        `invalid vectorAdditionModel: ${vectorAdditionModel}` );
      assert && assert( sceneNodes.filter( sceneNode => sceneNode instanceof SceneNode ).length === sceneNodes.length,
        `invalid sceneNodes: ${sceneNodes}` );

      super();

      //----------------------------------------------------------------------------------------

      // Add the scene nodes
      sceneNodes.forEach( ( sceneNode ) => {
        this.addChild( sceneNode );
      } );

      // Add the reset button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          vectorAdditionModel.reset();

          // loop through SceneNodes and reset each sceneNode
          sceneNodes.forEach( ( sceneNode ) =>
            sceneNode.reset()
          );
        },
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );
} );