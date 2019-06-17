// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class LabScreenView extends CommonScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      super( labModel, tandem, _, {
        vectorTypes: [ VectorAdditionConstants.VECTOR_TYPES.ONE, VectorAdditionConstants.VECTOR_TYPES.TWO ] });

      const graphControlPanel = new GraphControlPanel( labModel.sumVisibleProperty,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty,
        {
          is1D: false,
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      this.addChild( graphControlPanel );

      const vectorCreatorPanel = new LabVectorCreatorPanel(
        labModel.scenes[ 0 ].vectorSets[ 0 ].vectors,
        labModel.scenes[ 0 ].vectorSets[ 1 ].vectors,
        labModel.scenes[ 0 ].graph.modelViewTransformProperty );

      this.addChild( vectorCreatorPanel );
    }

  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );