// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends Vector and adds the following functionality:
 *  - A coefficient Property, and would scale the components/magnitude to the coefficient.
 *  - Instantiate a Base vector model. When the base vector model changes, this vector changes (multiply by coefficient)
 *  - Disables tip dragging and removing of vectors
 *
 * Equation vectors are created at the start of the sim, and are never disposed. They require a symbol.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVector = require( 'VECTOR_ADDITION/equation/model/BaseVector' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );

  // constants
  const DEFAULT_COEFFICIENT = 1;
  const COEFFICIENT_RANGE = new Range( -5, 5 );

  const VECTOR_OPTIONS = {
    isRemovable: false, // equation vectors are not removable
    isTipDraggable: false, // equation vectors are not draggable by the tip
    isOnGraphInitially: true // equation vectors are always on the graph
  };

  class EquationVector extends Vector {
    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {Vector2} baseVectorTailPosition - starting tail position of the base vector
     * @param {EquationGraph} graph - the equation graph the vector belongs to
     * @param {EquationVectorSet} vectorSet - the equationVectorSet that the vector belongs to
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition,
      initialComponents,
      baseVectorTailPosition,
      graph,
      vectorSet,
      equationTypeProperty,
      symbol
    ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );


      super( initialTailPosition, initialComponents, graph, vectorSet, symbol, VECTOR_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create coefficient ranges. One for each equation type.

      // @public (read-only) {NumberProperty} additionCoefficientProperty
      this.additionCoefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT );

      // @public (read-only) {NumberProperty} subtractionCoefficientProperty
      this.subtractionCoefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT );

      // @public (read-only) {NumberProperty} negationCoefficientProperty
      this.negationCoefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT );


      // @public (read-only) {DerivedProperty.<Number>}
      this.coefficientProperty = new DerivedProperty( [ this.additionCoefficientProperty,
        this.subtractionCoefficientProperty,
        this.negationCoefficientProperty,
        equationTypeProperty ],
        ( additionCoefficient, subtractionCoefficient, negationCoefficient, equationType ) => {

          if ( equationType === EquationTypes.ADDITION ) {
            return additionCoefficient;
          }
          else if ( equationType === EquationTypes.SUBTRACTION ) {
            return subtractionCoefficient;
          }
          else {
            return negationCoefficient;
          }
        } );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {BaseVector} baseVector - Instantiate a base vector
      this.baseVector = new BaseVector( baseVectorTailPosition,
        initialComponents.dividedScalar( DEFAULT_COEFFICIENT ),
        graph,
        vectorSet,
        symbol );


      // Observe when the base vector changes, or when the coefficient Properties change and update the vector.
      // Doesn't need to be unlinked since equation vectors are never disposed
      Property.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
        ( baseVector, coefficient ) => {
          this.vectorComponents = baseVector.timesScalar( coefficient );
        } );


      // @public (read-only) {Property.<Range>} coefficientRangeProperty - property of the range of the coefficient
      this.coefficientRangeProperty = new Property( COEFFICIENT_RANGE );

      this.fullfillInvariants( this.vectorComponents );
    }

    /**
     * Resets the equation vector. Called when the reset all button is clicked.
     * @public
     */
    reset() {
      this.additionCoefficientProperty.reset();
      this.subtractionCoefficientProperty.reset();
      this.negationCoefficientProperty.reset();
      this.baseVector.reset();
      this.tailPositionProperty.reset();
    }

    /**
     * @override
     * See Vector.getLabelContent() for documentation and context
     *
     * Gets the label content information to display the vector model. Equation Vectors have symbols.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null} // the coefficient (e.g. if the label displayed '3|v|=15', the coefficient would be
     *                               // 3). Null means it doesn't display a coefficient
     *    symbol: {string|null} // the symbol (e.g. if the label displayed '3|v|=15', the symbol would be '|v|')
     *                       // Null means it doesn't display a symbol
     *    value: {string|null} // the suffix (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                         // Null means it doesn't display a value
     * }
     */
    getLabelContent( valuesVisible ) {

      let coefficient;
      if ( this.coefficientProperty.value && this.coefficientProperty.value !== 1 ) {
        coefficient = `${this.coefficientProperty.value}`;
      }
      if ( this.coefficientProperty.value === -1 ) {
        coefficient = '-';
      }
      return _.extend( super.getLabelContent( valuesVisible ), {
        coefficient: coefficient
      } );
    }

  }

  return vectorAddition.register( 'EquationVector', EquationVector );
} );