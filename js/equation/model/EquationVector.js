// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how EquationVectors fit into the class
 * hierarchy.
 *
 * Extends Vector and adds the following functionality:
 *  - Instantiate a Base Vector. When the Base Vector's components change, this vector matches (multiply by coefficient)
 *  - 3 Coefficient Properties (1 for each equation type). The Equation Vector scales its components by the coefficient
 *    Property that corresponds with the current Equation Type.
 *  - 3 Tail Position Properties (1 for each equation type). See https://github.com/phetsims/vector-addition/issues/80
 *  - Disables tip dragging and removing of vectors
 *
 * Equation vectors are created at the start of the sim, and are never disposed. They require a symbol.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CartesianBaseVector = require( 'VECTOR_ADDITION/equation/model/CartesianBaseVector' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const PolarBaseVector = require( 'VECTOR_ADDITION/equation/model/PolarBaseVector' );
  const Property = require( 'AXON/Property' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2Property = require( 'DOT/Vector2Property' );
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

      // Loop through each Equation Type - each Equation Type has a separate coefficient Property
      // and a separate tail Position Property
      EquationTypes.VALUES.forEach( equationType => {

        const coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
          range: COEFFICIENT_RANGE
        } );

        const tailPositionProperty = new Vector2Property( this.tail );

        // Observe when the coefficient Property changes. If the equation Type matches, the coefficient
        // Properties match. Doesn't need to be unlinked.
        this.coefficientProperty.link( coefficient => {
          if ( equationGraph.equationTypeProperty.value === equationType ) {
            coefficientProperty.value = coefficient;
          }
        } );

        // Observe when the tail Position Property changes. If the equation Type matches, the tail
        // Properties match. Doesn't need to be unlinked.
        this.tailPositionProperty.link( tailPosition => {
          if ( equationGraph.equationTypeProperty.value === equationType ) {
            tailPositionProperty.value = tailPosition;
          }
        } );

        // On the other hand, observe when the equation Type changes. If the equation Type now matches,
        // the coefficientProperty must change to match the separate coefficientProperty, and the tailPosition
        // must be translated to match the separate tail Position. Doesn't need to be unlinked.
        equationGraph.equationTypeProperty.link( currentEquationType => {
          if ( currentEquationType === equationType ) {
            this.coefficientProperty.value = coefficientProperty.value;
            this.translateTailToPosition( tailPositionProperty.value );
          }
        } );
      } );

      //----------------------------------------------------------------------------------------

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
      // Doesn't need to be unlinked since equation vectors are never disposed
      Property.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
        ( baseVector, coefficient ) => {
          this.vectorComponents = baseVector.timesScalar( coefficient );
        } );
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