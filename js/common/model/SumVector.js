// Copyright 2019, University of Colorado Boulder

/**
 * SumVector is the model of a sum vector. A sum vector is the sum of all vectors for one VectorSet.
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * SumVectors can be directly manipulated. They can be translated, but not rotated or scale.
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
  const merge = require( 'PHET_CORE/merge' );
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

      // The sum vector displays its symbol when:
      // - the sum vector is active (selected), or
      // - a vector in its vector set is active, or
      // - there is only one vector set and no vector is active (selected), see #241
      const activeVector = this.graph.activeVectorProperty.value;
      const isSymbolDisplayed = activeVector === this ||
                                this.vectorSet.vectors.some( vector => vector === activeVector ) ||
                                ( this.graph.vectorSets.length === 1 && activeVector === null );

      if ( isSymbolDisplayed ) {

        // No change in behavior - do like we do for other vectors.
        return super.getLabelContent( valuesVisible );
      }
      else {

        // Omit the symbol, display only the value, if values are visible.
        const roundedMagnitude = Util.toFixed( this.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
        return merge( super.getLabelContent( valuesVisible ), {
          symbol: null,
          includeAbsoluteValueBars: false,
          value: valuesVisible ? roundedMagnitude : null
        } );
      }
    }
  }

  return vectorAddition.register( 'SumVector', SumVector );
} );