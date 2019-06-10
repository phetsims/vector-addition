// Copyright 2019, University of Colorado Boulder

/**
 * Model for the explore1D screen
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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  // constants
  const EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION = VectorAdditionConstants.EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION;

  class Explore1DModel extends CommonModel {

    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( tandem );

      // the 1d screen supports a different orientation
      this.vectorOrientationProperty.set( EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION );
    }
    /**
     * @abstract
     * @public
     * Create the graph model(s) (1D has 2 graph scenes)
     */
    instantiateGraphs() {

      // TODO: should this be put into the constants file, it is the same size for 1D 2D and lab
      const graphDimension = new Dimension2( 60, 40 );
      const graphUpperLeftPosition = new Vector2( -30, 20 );

      // @public {Graph} the horizontal Graph
      this.horizontalGraph = new Graph( graphDimension, graphUpperLeftPosition, VectorOrientation.HORIZONTAL );

      // @public {Graph} the vertical graph
      this.verticalGraph = new Graph( graphDimension, graphUpperLeftPosition, VectorOrientation.VERTICAL );
    }

    /**
     * @abstract
     * @public
     * Reset the graphs to their initial states respectively
     */
    resetGraphs() {
      
      this.horizontalGraph.reset();
      this.verticalGraph.reset();

    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );