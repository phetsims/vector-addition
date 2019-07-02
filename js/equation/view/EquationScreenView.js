// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );

  class EquationScreenView extends VectorAdditionScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {


      const equationScene = new SceneNode( equationModel.graph,
        equationModel.valuesVisibleProperty,
        equationModel.angleVisibleProperty,
        equationModel.gridVisibleProperty,
        equationModel.componentStyleProperty, {
          isExpandedInitially: true
        } );


      super( equationModel, [ equationScene ], tandem );

    }
  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );
