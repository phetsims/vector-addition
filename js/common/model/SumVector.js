// Copyright 2019, University of Colorado Boulder

/**
 * SumVector is the model of a sum vector. A sum vector is the sum of all vectors for one VectorSet.
 *
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * SumVectors are created at the start of the sim, and exist for the lifetime of the sim.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const SUM_VECTOR_OPTIONS = {
    isTipDraggable: false, // Sum vectors are not draggable by the tip.
    isRemovable: false, // Sum vectors are not removable which means they are also not disposable
    isOnGraphInitially: true // Sum vectors are always on the graph
  };

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;

  class SumVector extends Vector {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Graph} graph - graph the sum vector belongs to
     * @param {VectorSet} vectorSet - the VectorSet that the sum represents
     * @param {string|null} symbol - the symbol for the sum vector (e.g. 's', 'c', 'f')
     */
    constructor( initialTailPosition, graph, vectorSet, symbol ) {

      // Initialize an arbitrary vector model. Its components and magnitude to be set later.
      super( initialTailPosition, Vector2.ZERO, graph, vectorSet, symbol, SUM_VECTOR_OPTIONS );

      // @public (read-only) whether the sum is defined.  The sum is defined if there is at least one vector on
      // the graph. It would be preferable to set its Vector2 value to null, but this was discovered very late
      // in development, when that was not practical. See https://github.com/phetsims/vector-addition/issues/187
      this.isDefinedProperty = new BooleanProperty( vectorSet.vectors.lengthProperty.value > 0 );

      // Observe changes to the vector array. Never removed because SumVectors exists for the lifetime of the sim.
      vectorSet.vectors.addItemAddedListener( addedVector => {

        // When the vector changes, update the sum calculation. unmultilink is required when the vector is removed.
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

      // @private {function} isSymbolDisplayed - function to check if the sum vector should display its symbol.
      // The sum vector only displays its symbol when a vector in its vector set is active, or the sum is active.
      this.isSymbolDisplayed = () => {
        return vectorSet.vectors.some( vector => vector === graph.activeVectorProperty.value )
               || graph.activeVectorProperty.value === this
               || graph.activeVectorProperty.value === null;
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'SumVector is not intended to be disposed' );
    }

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

      // The sum is defined if there is at least one vector on the graph.
      this.isDefinedProperty.value = ( onGraphVectors.length > 0 );
    }

    /**
     * Gets the label content information to be displayed on the vector.
     * See RootVector.getLabelContent for details.
     * @override
     * @public
     * @param {boolean} valuesVisible - whether the values are visible
     * @returns {Object} see RootVector.getLabelContent
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