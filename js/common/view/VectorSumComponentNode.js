// Copyright 2019, University of Colorado Boulder

/**
 * View for a the component of the sum vector.
 *
 * Listens to a SumVisibleProperty to determine visibility.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );

  class VectorSumComponentNode extends VectorComponentNode {
    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Graph} graph - the graph the component belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     */
    constructor( vectorComponent, graph, componentStyleProperty, valuesVisibleProperty, sumVisibleProperty, options ) {

      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        arrowOptions: null,
      }, options );

      options.arrowOptions = _.extend( {
        tailWidth: 4.5,
        lineWidth: 0.2
      }, options.arrowOptions );

      //----------------------------------------------------------------------------------------

      super( vectorComponent, graph, componentStyleProperty, valuesVisibleProperty, options );

      // @private {Multilink} observe when either the component style changes or the sum visibility changes.
      // Doesn't need to be disposed because the sum always exists, and therefore the component always exists
      this.visibilityObserver = Property.multilink( [ sumVisibleProperty, componentStyleProperty ],
        ( sumVisible, componentStyle ) => {

          // Only visible when the sum is visible and the component style isn't invisible
          this.visible = sumVisible && componentStyle !== ComponentStyles.INVISIBLE;

        } );
    }
  }

  return vectorAddition.register( 'VectorSumComponentNode', VectorSumComponentNode );
} );