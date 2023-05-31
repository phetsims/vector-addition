// Copyright 2019-2023, University of Colorado Boulder

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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import Vector from './Vector.js';

// constants
const SUM_VECTOR_OPTIONS = {
  isTipDraggable: false, // Sum vectors are not draggable by the tip.
  isRemovable: false, // Sum vectors are not removable which means they are also not disposable
  isOnGraphInitially: true // Sum vectors are always on the graph
};

export default class SumVector extends Vector {

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
      const addedVectorMultilink = Multilink.multilink(
        [ addedVector.vectorComponentsProperty, addedVector.isOnGraphProperty ], () => {
          this.updateSum( vectorSet.vectors );
        } );

      // If the vector is removed, dispose of the multilink
      const vectorRemovedListener = removedVector => {
        if ( removedVector === addedVector ) {

          // Recalculate the sum
          this.updateSum( vectorSet.vectors );

          Multilink.unmultilink( addedVectorMultilink );
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
   * @param {ObservableArrayDef.<VectorsModel>} vectors
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
    // - there is only one sum vector on the graph (see #241), or
    // - the sum vector is selected, or
    // - a vector in the sum's vector set is selected
    const activeVector = this.graph.activeVectorProperty.value;
    const isSymbolDisplayed = this.graph.vectorSets.length === 1 ||
                              activeVector === this ||
                              this.vectorSet.vectors.some( vector => vector === activeVector );

    if ( isSymbolDisplayed ) {

      // No change in behavior - do like we do for other vectors.
      return super.getLabelContent( valuesVisible );
    }
    else {

      // Omit the symbol, display only the value, if values are visible.
      const roundedMagnitude = Utils.toFixed( this.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
      return merge( super.getLabelContent( valuesVisible ), {
        symbol: null,
        includeAbsoluteValueBars: false,
        value: valuesVisible ? roundedMagnitude : null
      } );
    }
  }
}

vectorAddition.register( 'SumVector', SumVector );