// Copyright 2019, University of Colorado Boulder

/**
 * EquationSumVector is a specialization of SumVector for the 'Equation' screen.  It computes the 'sum' differently
 * depending on the equation type.  Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Property = require( 'AXON/Property' );
  const SumVector = require( 'VECTOR_ADDITION/common/model/SumVector' );
  const Vector2 = require( 'DOT/Vector2' );
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

      assert && assert( equationTypeProperty instanceof EnumerationProperty && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      super( EQUATION_SUM_TAIL_POSITION, graph, vectorSet, symbol );

      // @private
      this.vectorSet = vectorSet;
      this.equationTypeProperty = equationTypeProperty;

      // Observe when each vector changes and/or when the equationType changes to calculate the sum.
      // unmultilink is unnecessary, exists for the lifetime of the sim.
      const dependencies = [];
      vectorSet.vectors.forEach( vector => {
        dependencies.push( vector.vectorComponentsProperty );
      } );
      Property.multilink( _.concat( [ equationTypeProperty ], dependencies ),
        () => {
          this.updateSum( vectorSet.vectors );
        } );
    }

    /**
     * Calculate the sum vector for the Equation screen.
     * @param {ObservableArray.<Vector>} vectors
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
     * Gets the label content information to be displayed on the vector.
     * See RootVector.getLabelContent for details.
     * @override
     * @public
     * @param {boolean} valuesVisible - whether the values are visible
     * @returns {Object} see RootVector.getLabelContent
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