// Copyright 2019, University of Colorado Boulder

/**
 * Shared screen view for all screens
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorAdditionScreenView extends ScreenView {

    /**
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Tandem} tandem
     */
    constructor( vectorAdditionModel, tandem ) {

      super();

      // @public (read-only) {Array.<SceneNode>}
      this.sceneNodes = [];

      vectorAdditionModel.scenes.forEach( ( scene ) => {

        // create a scene node and add it as a child
        const newSceneNode = new SceneNode( scene, vectorAdditionModel );
        this.addChild( newSceneNode );

        // add it to the sceneNode array
        this.sceneNodes.push( newSceneNode );

      } );

      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        vectorAdditionModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          vectorAdditionModel.reset();

          // loop through SceneNodes and reset each sceneNode
          this.sceneNodes.forEach( ( sceneNode ) =>
            sceneNode.reset()
          );

        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );
} )
;