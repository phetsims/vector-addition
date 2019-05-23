// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const GridNode = require( 'VECTOR_ADDITION/common/view/GridNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorDisplayNode = require( 'VECTOR_ADDITION/common/view/VectorDisplayNode' );
  const VectorPanel = require( 'VECTOR_ADDITION/common/view/VectorPanel' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {Bounds2} gridViewBounds
     * @param {commonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( gridViewBounds, commonModel, tandem ) {

      super();

      this.modelViewTransform = new ModelViewTransform2.createRectangleInvertedYMapping( commonModel.gridModelBounds, gridViewBounds );

      const gridNode = new GridNode( commonModel, this.modelViewTransform );

      this.addChild( gridNode );

      const modelVector = new Vector( new Vector2Property( new Vector2( 0, 0 ) ),
        new Vector2Property( new Vector2( 5, 0 ) ),
        new BooleanProperty( false ),
        new NumberProperty( 0 ) );

      const vectorDisplayNode = new VectorDisplayNode( modelVector );

      vectorDisplayNode.centerX = this.layoutBounds.maxX / 2;
      vectorDisplayNode.top = 10;
      this.addChild( vectorDisplayNode );

      const vectorPanel = new VectorPanel( modelVector, commonModel.gridModelBounds, this.modelViewTransform );
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