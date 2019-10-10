// Copyright 2019, University of Colorado Boulder

/**
 * EquationVector is a specialization of Vector for the 'Equation' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CartesianBaseVector = require( 'VECTOR_ADDITION/common/model/CartesianBaseVector' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const PolarBaseVector = require( 'VECTOR_ADDITION/common/model/PolarBaseVector' );
  const Property = require( 'AXON/Property' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants

  // initial coefficient and range
  const DEFAULT_COEFFICIENT = 1;
  const COEFFICIENT_RANGE = new Range( -5, 5 );

  // super class options
  const OPTIONS = {
    isRemovable: false,       // Equation Vectors are not removable
    isTipDraggable: false,    // Equation Vectors are not draggable by the tip
    isOnGraphInitially: true  // Equation Vectors are always on the equationGraph
  };

  class EquationVector extends Vector {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {Vector2} baseVectorTailPosition - starting tail position of the base vector
     * @param {EquationGraph} equationGraph - the equation graph the vector belongs to
     * @param {EquationVectorSet} equationVectorSet - the equationVectorSet that the vector belongs to
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition,
                 initialComponents,
                 baseVectorTailPosition,
                 equationGraph,
                 equationVectorSet,
                 symbol
    ) {


      super( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol, OPTIONS );

      // @public (read-only)
      this.coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
        range: COEFFICIENT_RANGE
      } );

      // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
      this.setTipWithInvariants( this.tip );

      // @public (read-only) {BaseVector} instantiate a base vector based on snap mode
      this.baseVector = null;
      if ( equationGraph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
        this.baseVector = new CartesianBaseVector( baseVectorTailPosition,
          this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ),
          equationGraph,
          equationVectorSet,
          symbol );
      }
      else {
        this.baseVector = new PolarBaseVector( baseVectorTailPosition,
          this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ),
          equationGraph,
          equationVectorSet,
          symbol );
      }

      // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
      // unmultilink is unnecessary, exists for the lifetime of the sim.
      Property.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
        ( baseVector, coefficient ) => {
          this.vectorComponents = baseVector.timesScalar( coefficient );
        } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'EquationVector is not intended to be disposed' );
    }

    /**
     * Resets the equation vector. Called when the reset all button is clicked.
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
      return _.extend( super.getLabelContent( valuesVisible ), {
        coefficient: this.coefficientProperty.value
      } );
    }
  }

  return vectorAddition.register( 'EquationVector', EquationVector );
} );