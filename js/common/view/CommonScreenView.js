// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules

  const GridNode = require( 'VECTOR_ADDITION/common/view/GridNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorDisplayPanel = require( 'VECTOR_ADDITION/common/view/VectorDisplayPanel' );
  const VectorPanel = require( 'VECTOR_ADDITION/common/view/VectorPanel' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {Bounds2} gridViewBounds
     * @param {CommonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( gridViewBounds, commonModel, tandem ) {

      super();

      this.modelViewTransform = new ModelViewTransform2.createRectangleInvertedYMapping( commonModel.gridModelBounds, gridViewBounds );

      const gridNode = new GridNode( commonModel, this.modelViewTransform );

      this.addChild( gridNode );

      const vectorDisplayPanel = new VectorDisplayPanel( commonModel.vectors );

      vectorDisplayPanel.left = 195;
      vectorDisplayPanel.top = 12;
      this.addChild( vectorDisplayPanel );

      const vectorPanel = new VectorPanel( commonModel, this.modelViewTransform );

      this.addChild( vectorPanel );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          commonModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'CommonScreenView', CommonScreenView );
} );