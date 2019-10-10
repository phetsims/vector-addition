// Copyright 2019, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class GraphOrientationRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty.<GraphOrientations>} graphOrientationProperty
     * @param {Object} [options]
     */
    constructor( graphOrientationProperty, options ) {

      assert && assert( graphOrientationProperty instanceof EnumerationProperty && GraphOrientations.includes( graphOrientationProperty.value ),
        `invalid graphOrientationProperty: ${graphOrientationProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, options );

      // Create the description of the buttons
      const content = [];
      [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ].forEach( graphOrientation => {
        content.push( {
          value: graphOrientation,
          node: VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
        } );
      } );

      super( graphOrientationProperty, content, options );
    }
  }

  return vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );
} );