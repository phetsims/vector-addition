// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends Vector and adds the following functionality:
 *  - Takes an array of EquationVectors and calculates its components based on the vectors and the
 *    equationType
 *  - Separate Tail Positions for each Equation Type
 *  - Disables tip dragging and removing of vectors
 *
 * Equation sum vectors are created at the start of the sim, and are never disposed. They require a symbol.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Property = require( 'AXON/Property' );
  const SumVector = require( 'VECTOR_ADDITION/common/model/SumVector' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const EQUATION_SUM_TAIL_POSITION = new Vector2( 25, 5 );

  class EquationSumVector extends SumVector {

    /**
     * @param {Graph} graph - graph the sum vector belongs to
     * @param {VectorSet} vectorSet - the vector set that the sum vector represents
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( graph, vectorSet, equationTypeProperty, symbol ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      super( EQUATION_SUM_TAIL_POSITION, graph, vectorSet, symbol );

      // @private
      this.vectorSet = vectorSet;
      this.equationTypeProperty = equationTypeProperty;

      //----------------------------------------------------------------------------------------
      // Observe when each vector changes and/or when the equationType changes to calculate the sum
      const dependencies = [];

      vectorSet.vectors.forEach( vector => {
        dependencies.push( vector.vectorComponentsProperty );
      } );

      // Doesn't need to be unlinked since each vector in equationVectorSet are never disposed and the equation vector
      // sum is never disposed
      Property.multilink( _.concat( [ equationTypeProperty ], dependencies ),
        () => {
          this.updateSum( vectorSet.vectors );
        } );

      //----------------------------------------------------------------------------------------
      // Integrate separate tail positions for each equation type
      EquationTypes.VALUES.forEach( equationType => {

        const tailPositionProperty = new Vector2Property( this.tail );

        equationTypeProperty.link( currentEquationType => {
          if ( currentEquationType === equationType ) {
            this.translateTailToPosition( tailPositionProperty.value );
          }
        } );

        this.tailPositionProperty.link( tailPosition => {
          if ( equationTypeProperty.value === equationType ) {
            tailPositionProperty.value = tailPosition;
          }
        } );
      } );
    }

    //TODO VectorsModel does not exist
    /**
     * Calculate the sum vector for the Equation screen.
     * @param {ObservableArray.<VectorsModel>} vectors
     * @public
     * @override
     */
    updateSum( vectors ) {

      const equationType = this.equationTypeProperty.value;

      // Denoted by 'a' + 'b' = 'c'
      if ( equationType === EquationTypes.ADDITION ) {
        const sum = new Vector2( 0, 0 );

        vectors.forEach( vector => {
          sum.add( vector.vectorComponents );
        } );

        this.vectorComponents = sum;
      }
      else if ( equationType === EquationTypes.SUBTRACTION ) {
        const calculatedComponents = vectors.get( 0 ).vectorComponents.copy();

        // Subtract from the first vector
        _.drop( vectors.getArray() ).forEach( vector => {
          calculatedComponents.subtract( vector.vectorComponents );
        } );

        this.vectorComponents = calculatedComponents;
      }
      else if ( equationType === EquationTypes.NEGATION ) {
        // Same as addition but negated  : a + b = -c or a + b + c = 0
        const sum = new Vector2( 0, 0 );

        vectors.forEach( vector => {
          sum.add( vector.vectorComponents );
        } );

        this.vectorComponents = sum.negate();
      }
    }

    /**
     * See RootVector.getLabelContent() for context
     *
     * Gets the label content information to display the vector model. Equation sum vectors always show their label.
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
     * @public
     * @override
     */
    getLabelContent( valuesVisible ) {
      return _.extend( super.getLabelContent( valuesVisible ), {
        symbol: this.symbol
      } );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();

      // In the Equations screen, vectors are never removed, so we need to explicitly call updateSum.
      // See https://github.com/phetsims/vector-addition/issues/129
      this.updateSum( this.vectorSet.vectors );
    }
  }

  return vectorAddition.register( 'EquationSumVector', EquationSumVector );
} );