// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends Vector and adds the following functionality:
 *  - Takes an array of EquationVectors and calculates its components based on the vectors and the
 *    equationType
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
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  // constants
  const EQUATION_SUM_TAIL_POSITION = new Vector2( 25, 10 );

  class EquationVectorSum extends VectorSum {
    /**
     * @param {Graph} graph - graph the vector sum belongs to
     * @param {VectorSet} - the vector set that the sum represents
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( graph, vectorSet, equationTypeProperty, symbol ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      super( EQUATION_SUM_TAIL_POSITION, graph, vectorSet, symbol );


      //----------------------------------------------------------------------------------------
      // Observe when each vector changes and/or when the equationType changes to calculate the sum
      const dependencies = [];

      vectorSet.vectors.forEach( vector => {
        dependencies.push( vector.vectorComponentsProperty );
      } );

      // Doesn't need to be unlinked since each vector in equationvectorSet are never disposed and the equation vector
      // sum is never disposed
      Property.multilink( _.concat( [ equationTypeProperty ], dependencies ),
        ( equationType ) => {
          this.updateSum( vectorSet.vectors, equationType );
        } );


      EquationTypes.VALUES.forEach( equationType => {

        const tailPositionProperty = new Vector2Property( this.tail );


        equationTypeProperty.link( eType => {
          if ( eType === equationType ) {
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

    /**
     * @override
     * Calculate the vector sum for the equation screen.
     *
     * @param {ObservableArray.<VectorsModel>} vectors
     * @param {EquationTypes} equationType
     * @public
     */
    updateSum( vectors, equationType ) {

      // Denoted by 'a' + 'b' = 'c'
      if ( equationType === EquationTypes.ADDITION ) {
        const sum = new Vector2( 0, 0 );

        vectors.forEach( vector => {
          sum.add( vector.vectorComponents );
        } );

        this.vectorComponents = sum;
      }
      else if ( equationType === EquationTypes.SUBTRACTION ) {
        const difference = new Vector2( 0, 0 );

        let vectorIndex = 0;
        vectors.forEach( vector => {
          if ( !vectorIndex ) {
            difference.add( vector.vectorComponents );
          }
          else {
            difference.subtract( vector.vectorComponents );
          }
          vectorIndex++;
        } );

        this.vectorComponents = difference;
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
     * @override
     * @public
     * See RootVector.getLabelContent() for context
     *
     * Gets the label content information to display the vector model. Equation Vector Sums always show their tag.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null}  // The coefficient (e.g. if the label displayed '3|v|=15', the coefficient would
     *                                // be '3'). 'null' means to not display a coefficient
     *    symbol: {string|null}       // The symbol (e.g. if the label displayed '3|v|=15', the symbol would be '|v|')
     *                                // 'null' means to not display a symbol
     *    value: {string|null}        // The value (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                                // 'null' means to not display a value
     * }
     */
    getLabelContent( valuesVisible ) {
      return _.extend( super.getLabelContent( valuesVisible ), {
        symbol: this.symbol
      } );
    }
  }

  return vectorAddition.register( 'EquationVectorSum', EquationVectorSum );
} );