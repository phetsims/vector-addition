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
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class Scene {
    /**
     * @abstract
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    constructor( graphDimension, graphUpperLeftPosition, componentStyleProperty ) {

      // Type check
      assert && assert( graphDimension instanceof Dimension2,
        `invalid graphDimension: ${graphDimension}` );
      assert && assert( graphUpperLeftPosition instanceof Vector2,
        `invalid graphUpperLeftPosition: ${graphUpperLeftPosition}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      // @public {graph} graph - the graph for this scene (each scene can only have one graph)
      this.graph = new Graph( graphDimension, graphUpperLeftPosition );

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
