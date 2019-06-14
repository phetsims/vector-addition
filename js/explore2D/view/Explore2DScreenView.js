// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class Explore2DScreenView extends CommonScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      super( explore2DModel, tandem, VectorAdditionConstants.VECTOR_TYPES.ONE );

      const graphControlPanel = new GraphControlPanel( explore2DModel.sumVisibleProperty,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        {
          is1D: false,
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      this.addChild( graphControlPanel );

      const vectorCreatorPanel = new Explore2DVectorCreatorPanel(
        explore2DModel.scenes[ 0 ].vectorSets[ 0 ].vectors,
        explore2DModel.scenes[ 0 ].graph.modelViewTransformProperty );

      this.addChild( vectorCreatorPanel );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );