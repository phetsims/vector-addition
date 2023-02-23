// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsVector is a specialization of Vector for the 'Equations' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';

// constants

// initial coefficient and range
const DEFAULT_COEFFICIENT = 1;
const COEFFICIENT_RANGE = new Range( -5, 5 );

// super class options
const OPTIONS = {
  isRemovable: false,       // Equations vectors are not removable
  isTipDraggable: false,    // Equations vectors are not draggable by the tip
  isOnGraphInitially: true  // Equations vectors are always on the graph
};

export default class EquationsVector extends Vector {

  /**
   * @param {Vector2} initialTailPosition - starting tail position of the vector
   * @param {Vector2} initialComponents - starting components of the vector
   * @param {Vector2} baseVectorTailPosition - starting tail position of the base vector
   * @param {EquationsGraph} graph - the graph the vector belongs to
   * @param {EquationsVectorSet} vectorSet - the VectorSet that the vector belongs to
   * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   */
  constructor( initialTailPosition,
               initialComponents,
               baseVectorTailPosition,
               graph,
               vectorSet,
               symbol
  ) {


    super( initialTailPosition, initialComponents, graph, vectorSet, symbol, OPTIONS );

    // @public (read-only)
    this.coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
      range: COEFFICIENT_RANGE
    } );

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipWithInvariants( this.tip );

    // @public (read-only) {BaseVector} instantiate a base vector based on snap mode
    this.baseVector = null;
    if ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
      this.baseVector = new CartesianBaseVector( baseVectorTailPosition,
        this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ), graph, vectorSet, symbol );
    }
    else {
      this.baseVector = new PolarBaseVector( baseVectorTailPosition,
        this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ), graph, vectorSet, symbol );
    }

    // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
      ( baseVector, coefficient ) => {
        this.vectorComponents = baseVector.timesScalar( coefficient );
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EquationsVector is not intended to be disposed' );
  }

  /**
   * Resets the vector.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.coefficientProperty.reset();
    this.baseVector.reset();
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
    return merge( super.getLabelContent( valuesVisible ), {
      coefficient: this.coefficientProperty.value
    } );
  }
}

vectorAddition.register( 'EquationsVector', EquationsVector );