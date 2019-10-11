// Copyright 2019, University of Colorado Boulder

/**
 * SumVectorNode is the view for a sum vector.
 *
 * Extends VectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables ability to take the sum vector node off of the graph
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const SumVector = require( 'VECTOR_ADDITION/common/model/SumVector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class SumVectorNode extends VectorNode {
    /**
     * @param {SumVector} sumVector - the model for the sum vector
     * @param {Graph} graph - the graph the sum belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [options]
     */
    constructor( sumVector, graph, valuesVisibleProperty, anglesVisibleProperty, sumVisibleProperty, options ) {

      assert && assert( sumVector instanceof SumVector, `invalid sumVector: ${sumVector}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( anglesVisibleProperty instanceof BooleanProperty, `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = merge( {
        arrowOptions: merge( {}, VectorAdditionConstants.SUM_VECTOR_ARROW_OPTIONS, {
          fill: sumVector.vectorColorPalette.sumFill,
          stroke: sumVector.vectorColorPalette.sumStroke
        } )
      }, options );

      //----------------------------------------------------------------------------------------

      super( sumVector, graph, valuesVisibleProperty, anglesVisibleProperty, options );

      // Make the sum vector visible only if it is defined, meaning that there is at least 1 vector on the graph.
      // See https://github.com/phetsims/vector-addition/issues/187
      // unmultilink is unnecessary, exists for the lifetime of the sim.
      Property.multilink(
        [ sumVisibleProperty, sumVector.isDefinedProperty ],
        ( sumVisible, isDefined ) => {
          this.visible = ( sumVisible && isDefined );
        } );

      // Making an active sum vector invisible clears activeVectorProperty. See #112.
      // unlink is unnecessary, exists for the lifetime of the sim.
      sumVisibleProperty.link( sumVisible => {
        if ( !sumVisible && graph.activeVectorProperty.value === sumVector ) {
          graph.activeVectorProperty.value = null;
        }
      } );

      // When the sum vector becomes invisible, interrupt interactions.
      // See https://github.com/phetsims/vector-addition/issues/201
      this.on( 'visibility', () => {
        if ( !this.visible ) {
          this.interruptSubtreeInput();
        }
      } );

      // Double check that the vector node never is animated back
      // unlink is unnecessary, exists for the lifetime of the sim.
      assert && sumVector.animateBackProperty.link( animateBack => {
        if ( animateBack ) {
          assert( false, 'SumVectorNode instances never animated back' );
        }
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'SumVectorNode is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'SumVectorNode', SumVectorNode );
} );