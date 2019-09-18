// Copyright 2019, University of Colorado Boulder

/**
 * Model for a sum vector. A sum vector is the sum of all vectors for only one vector set.
 *
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * SumVectors are created at the start of the sim, and exist throughout the entire simulation, leaving links as is.
 * However, they can be reset (which solely resets the location).
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const SUM_VECTOR_OPTIONS = {
    isTipDraggable: false, // Sum vector are not draggable by the tip.
    isRemovable: false, // Sum vector are not removable which means they are also not disposable
    isOnGraphInitially: true // Sum vector are always on the graph
  };

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;

  class SumVector extends Vector {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Graph} graph - graph the sum vector belongs to
     * @param {VectorSet} vectorSet - the vector set that the sum represents
     * @param {string|null} symbol - the symbol for the sum vector (e.g. 's', 'c', 'f')
     */
    constructor( initialTailPosition, graph, vectorSet, symbol ) {

      // Initialize an arbitrary vector model. Its components and magnitude to be set later.
      super( initialTailPosition, Vector2.ZERO, graph, vectorSet, symbol, SUM_VECTOR_OPTIONS );

      //----------------------------------------------------------------------------------------

      // Observe changes to the vector array. Never removed because the sum vector exists throughout the entire sim.
      vectorSet.vectors.addItemAddedListener( addedVector => {

        // Observe when the vector changes to update the sum calculation
        const addedVectorMultilink = Property.multilink(
          [ addedVector.vectorComponentsProperty, addedVector.isOnGraphProperty ], () => {
            this.updateSum( vectorSet.vectors );
          } );

        // If the vector is removed, dispose of the multilink
        const vectorRemovedListener = removedVector => {
          if ( removedVector === addedVector ) {

            // Recalculate the sum
            this.updateSum( vectorSet.vectors );

            Property.unmultilink( addedVectorMultilink );
            vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
          }
        };

        vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
      } );

      //----------------------------------------------------------------------------------------
      // @private {function} isSymbolDisplayed - function to check if the sum vector should display its symbol.
      // The sum vector only displays the symbol when either a vector in its vector set is active, the sum is active, or
      // the activeVectorProperty.value is null
      this.isSymbolDisplayed = () => {
        return vectorSet.vectors.some( vector => vector === graph.activeVectorProperty.value )
               || graph.activeVectorProperty.value === this
               || graph.activeVectorProperty.value === null;
      };
    }

    /**
     * The sum is never disposed. Double check to make sure the sum isn't ever disposed.
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'SumVector instances should never be disposed' ); }

    /**
     * Update the sum vector components. Calculated from all the vectors that are on the graph.
     * @protected
     *
     * @param {ObservableArray.<VectorsModel>} vectors
     */
    updateSum( vectors ) {

      // Filter to get only the vectors that are on the graph
      const onGraphVectors = vectors.filter( vector => {
        return vector.isOnGraphProperty.value;
      } );

      // Loop through and calculate the sum of all vectors that are on the graph
      const sumVectorComponents = new Vector2( 0, 0 );

      onGraphVectors.forEach( vector => {
        sumVectorComponents.add( vector.vectorComponents );
      } );

      // Set the sum to the calculated sum
      this.vectorComponents = sumVectorComponents;
    }

    /**
     * @override
     * @public
     * See RootVector.getLabelContent() for context
     *
     * Gets the label content information to display the sum vector. Sum vector only display their symbol when either
     * a vector in its vector set is active, the sum is active, or the activeVectorProperty.value is null
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null}             // The coefficient (e.g. if the label displayed '|3v|=15', the
     *                                           // coefficient would be '3'). Null means to not display a coefficient
     *    symbol: {string|null}                  // The symbol (e.g. if the label displayed '|3v|=15', the symbol would
     *                                           // be 'v'). Null means to not display a symbol
     *    value: {string|null}                   // The value (e.g. if the label displayed '|3v|=15', the value would
     *                                           // be '=15'). Null means to not display a value
     *    includeAbsoluteValueBars: {boolean}    // Include absolute value bars (e.g. if the label displayed '|3v|=15
     *                                           // the includeAbsoluteValueBars would be true)
     * }
     */
    getLabelContent( valuesVisible ) {
      if ( !this.isSymbolDisplayed() ) {

        // Get the rounded magnitude
        const roundedMagnitude = Util.toFixed( this.magnitude, VECTOR_VALUE_ROUNDING );

        return _.extend( super.getLabelContent( valuesVisible ), {
          symbol: null,
          includeAbsoluteValueBars: false,
          value: valuesVisible ? roundedMagnitude : null
        } );
      }
      else {
        return super.getLabelContent( valuesVisible );
      }
    }
  }

  return vectorAddition.register( 'SumVector', SumVector );
} );