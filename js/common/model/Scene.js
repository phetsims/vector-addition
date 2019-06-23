// Copyright 2019, University of Colorado Boulder

/**
 * Model for the each scene. Each screen can have multiple scenes, and each scene can have multiple vector sets
 * (see VectorSet.js for documentation).
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {GraphOrientations} graphOrientation
     */
    constructor( graphDimension, graphUpperLeftPosition, graphOrientation, vectorSets ) {

      // Type check
      assert && assert( graphDimension instanceof Dimension2,
        `invalid graphDimension: ${graphDimension}` );
      assert && assert( graphUpperLeftPosition instanceof Vector2,
        `invalid graphUpperLeftPosition: ${graphUpperLeftPosition}` );


      //----------------------------------------------------------------------------------------

      // @public {graph} graph - the graph for this scene (each scene can only have one graph)
      this.graph = new Graph( graphDimension, graphUpperLeftPosition, graphOrientation );

      // @public (read-only) {array.<VectorSet>} vectorSets - array for the vector sets (each scene can have a
      // different number of vectorSets)
      this.vectorSets = [];


      /*---------------------------------------------------------------------------*
       * Sub Classes are Responsible for creating the vector sets
       *---------------------------------------------------------------------------*/

    }

    /**
     * @public
     * Reset the scene
     */
    reset() {
      // reset the graph
      this.graph.reset();
      this.resetVectorSets();
    }

    /**
     * @public
     * Reset the vectorSets only
     */
    resetVectorSets() {
      // reset the each vectorSet in vectorSets
      this.vectorSets.forEach( vectorSet =>
        vectorSet.reset()
      );
    }
  }

  return vectorAddition.register( 'Scene', Scene );
} );
