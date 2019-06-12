// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Lab screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  class LabModel extends CommonModel {
    /**
     * @abstract
     * @public
     * Create the graph model(s)
     */
    instantiateGraphs() {

      // TODO: should this be put into the constants file, it is the same size for 1D 2D and lab
      const graphDimension = new Dimension2( 60, 40 );
      const graphUpperLeftPosition = new Vector2( -5, 35 );

      // @public {Graph} the horizontal Graph
      this.graph = new Graph( graphDimension, graphUpperLeftPosition, this.vectorOrientationProperty.value );
      this.graph.vectors2 = new ObservableArray();

      this.graph.vectorSum2 = new VectorSum( this.graph.vectors2, this.graph.modelViewTransformProperty, this.graph.graphModelBounds );
    }

    /**
     * @abstract
     * @public
     * Reset the graphs to their initial states respectively
     */
    resetGraphs() {
      this.graph.reset();
    }

  }

  return vectorAddition.register( 'LabModel', LabModel );
} );