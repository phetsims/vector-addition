// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {CommonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( commonModel, tandem ) {

      super();

      const scene = new SceneNode( commonModel, commonModel.graph );
      this.scene = scene;
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup( commonModel.coordinateSnapModeProperty );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          commonModel.reset();
          scene.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      this.setChildren([ scene, coordinateSnapRadioButtonGroup, resetAllButton ]);
    }
  }

  return vectorAddition.register( 'CommonScreenView', CommonScreenView );
} )
;