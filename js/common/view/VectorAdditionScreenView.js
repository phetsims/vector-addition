// Copyright 2019, University of Colorado Boulder

/**
 * Shared screen view for all screens
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorAdditionScreenView extends ScreenView {

    /**
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Tandem} tandem
     * @param {Object} [sceneNodeOptions]
     */
    constructor( vectorAdditionModel, sceneNodes, tandem ) {

      super();

      sceneNodes.forEach( ( sceneNode ) => {
        this.addChild( sceneNode );
      } );


      const resetAllButton = new ResetAllButton( {
        listener: () => {
          vectorAdditionModel.reset();

          // loop through SceneNodes and reset each sceneNode
          sceneNodes.forEach( ( sceneNode ) =>
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