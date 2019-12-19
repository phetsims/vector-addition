// Copyright 2019, University of Colorado Boulder

/**
 * VectorSetNode is responsible for creating the view for all vectors associated with a VectorSet.
 *
 * Responsibilities include:
 * - creating the Nodes for the sum vector and sum component vectors
 * - creating and managing Nodes for registered vectors
 * - handling layering of all Nodes related to vectors in the VectorSet
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BaseVector = require( 'VECTOR_ADDITION/common/model/BaseVector' );
  const ComponentVectorNode = require( 'VECTOR_ADDITION/common/view/ComponentVectorNode' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const SceneryEvent = require( 'SCENERY/input/SceneryEvent' );
  const SumComponentVectorNode = require( 'VECTOR_ADDITION/common/view/SumComponentVectorNode' );
  const SumVectorNode = require( 'VECTOR_ADDITION/common/view/SumVectorNode' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class VectorSetNode extends Node {

    /**
     * @param {Graph} graph
     * @param {VectorSet} vectorSet
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {Property.<boolean>} anglesVisibleProperty
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( graph, vectorSet, valuesVisibleProperty, anglesVisibleProperty, componentStyleProperty, options ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( valuesVisibleProperty instanceof Property, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( anglesVisibleProperty instanceof Property, `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );

      options = merge( {}, options );

      // Every VectorSet has a sum vector and sum component vectors, so create them
      const sumVectorNode = new SumVectorNode( vectorSet.sumVector, graph,
        valuesVisibleProperty, anglesVisibleProperty, vectorSet.sumVisibleProperty
      );
      const xSumComponentVectorNode = new SumComponentVectorNode( vectorSet.sumVector.xComponentVector, graph,
        componentStyleProperty, valuesVisibleProperty, vectorSet.sumVisibleProperty );
      const ySumComponentVectorNode = new SumComponentVectorNode( vectorSet.sumVector.yComponentVector, graph,
        componentStyleProperty, valuesVisibleProperty, vectorSet.sumVisibleProperty );
      assert && assert( !options.children, 'VectorSetNode sets children' );
      options.children = [ xSumComponentVectorNode, ySumComponentVectorNode, sumVectorNode ];

      super( options );

      // @public (read-only)
      this.vectorSet = vectorSet;

      // @private
      this.graph = graph;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.anglesVisibleProperty = anglesVisibleProperty;
      this.componentStyleProperty = componentStyleProperty;

      // When the sum vector becomes selected, move it and its component vectors to the front.
      // unlink is unnecessary, exists for the lifetime of the sim.
      graph.activeVectorProperty.link( activeVector => {
        if ( activeVector === sumVectorNode.vector ) {

          // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
          this.moveToFront();

          // order is important - sum should be in front of components
          xSumComponentVectorNode.moveToFront();
          ySumComponentVectorNode.moveToFront();
          sumVectorNode.moveToFront();
        }
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'VectorSetNode is not intended to be disposed' );
    }

    /**
     * Registers a Vector by creating its associated VectorNode and the ComponentVectorNodes.
     * The Nodes are deleted if Vector is ever removed from its VectorSet.
     * @public
     * @param {Vector} vector - the vector model
     * @param {SceneryEvent} [forwardingEvent] - if provided, if will forward this event to the Vector body drag
     *                                           listener. This is used to forward the click event from the
     *                                           VectorCreatorPanel to the VectorNode. If not provided, no event is
     *                                           forwarded.
     */
    registerVector( vector, forwardingEvent ) {

      assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
      assert && assert( !forwardingEvent || forwardingEvent instanceof SceneryEvent, `invalid forwardingEvent: ${forwardingEvent}` );

      // Create the view for the vector and its component vectors
      const vectorNode = new VectorNode( vector, this.graph, this.valuesVisibleProperty, this.anglesVisibleProperty );

      const xComponentVectorNode = new ComponentVectorNode( vector.xComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      const yComponentVectorNode = new ComponentVectorNode( vector.yComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      this.addChild( xComponentVectorNode );
      this.addChild( yComponentVectorNode );
      this.addChild( vectorNode );

      // Optional event forwarding
      if ( forwardingEvent ) {
        vectorNode.forwardEvent( forwardingEvent );
      }

      // When the vector becomes active (selected), move it and its components to the front.
      // unlink is required when the vector is removed.
      const activeVectorListener = activeVector => {
        if ( activeVector === vectorNode.vector ) {

          // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
          this.moveToFront();

          // order is important - vector should be in front of components
          xComponentVectorNode.moveToFront();
          yComponentVectorNode.moveToFront();
          vectorNode.moveToFront();
        }
      };
      this.graph.activeVectorProperty.link( activeVectorListener );

      // If the Vector is removed from the VectorSet, clean up.
      if ( vector.isRemovable ) {

        const removalListener = removedVector => {
          assert && assert( removedVector.isRemovable, 'vector is not removable' );

          if ( removedVector === vector ) {

            // dispose the Nodes that were created
            xComponentVectorNode.dispose();
            yComponentVectorNode.dispose();
            vectorNode.dispose();

            // remove listeners
            this.vectorSet.vectors.removeItemRemovedListener( removalListener );
            this.graph.activeVectorProperty.unlink( activeVectorListener );
          }
        };

        this.vectorSet.vectors.addItemRemovedListener( removalListener );
      }
    }

    /**
     * Adds a base vector to the VectorSetNode.  Base vectors are never removed.
     * Base vectors do not have component vectors, see https://github.com/phetsims/vector-addition/issues/158
     * @param {BaseVector} baseVector
     * @param {Property.<boolean>} baseVectorsVisibleProperty
     * @public
     */
    addBaseVector( baseVector, baseVectorsVisibleProperty ) {

      assert && assert( baseVector instanceof BaseVector, 'invalid baseVector' );
      assert && assert( baseVectorsVisibleProperty instanceof Property, 'invalid baseVectorsVisibleProperty' );

      // Node for the base vector
      const baseVectorNode = new VectorNode( baseVector, this.graph,
        this.valuesVisibleProperty,
        this.anglesVisibleProperty, {
          arrowOptions: merge( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
            fill: this.graph.vectorSet.vectorColorPalette.baseVectorFill,
            stroke: this.graph.vectorSet.vectorColorPalette.baseVectorStroke
          } )
        } );
      this.addChild( baseVectorNode );

      // Handle visibility
      baseVectorsVisibleProperty.linkAttribute( baseVectorNode, 'visible' );

      // When the base vector becomes active (selected), move it (and the entire vector set) to the front.
      // unlink is unnecessary because base vectors exist for the lifetime of the sim.
      this.graph.activeVectorProperty.link( activeVector => {
        if ( activeVector === baseVectorNode.vector ) {

          // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
          this.moveToFront();

          // move the base vector to the front
          baseVectorNode.moveToFront();
        }
      } );
    }
  }

  return vectorAddition.register( 'VectorSetNode', VectorSetNode );
} );