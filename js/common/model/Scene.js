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
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class Scene {
    /** 
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     * @param {object} [options]
     */
     constructor( graphDimension, graphUpperLeftPosition, numberOfVectorSets, options ) {

        // @public {graph} graph - the graph for this scene (each scene can only have one graph)
        this.graph = new Graph( graphDimension, graphUpperLeftPosition, options );

        // @public (read-only) {array.<VectorSet>} vectorSets - array for the vector sets (each scene can have a 
        // different number of vectorSets)
        this.vectorSets = [];

        // Create the Vector Sets and push it to this.vectorSets
        for ( let i = 0; i < numberOfVectorSets; i++ ) {
          this.vectorSets.push( new VectorSet( this.graph.modelViewTransformProperty, this.graph.graphModelBounds ) );
        }

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
      for ( let i = 0; i < this.vectorSets.length; i++ ) {
        this.vectorSets[ i ].reset();
      }
    }
  }

  return vectorAddition.register( 'Scene', Scene );
} );
