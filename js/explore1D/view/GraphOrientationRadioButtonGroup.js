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

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;


  class GraphOrientationRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty.<GraphOrientations>} graphOrientationProperty
     * @param {Object} [options]
     */
    constructor( graphOrientationProperty, options ) {

      assert && assert( graphOrientationProperty instanceof EnumerationProperty
      && GraphOrientations.includes( graphOrientationProperty.value ),
        `invalid graphOrientationProperty: ${graphOrientationProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, RADIO_BUTTON_OPTIONS, {

        // Superclass options
        orientation: 'horizontal',
        buttonContentXMargin: RADIO_BUTTON_OPTIONS.xMargin,
        buttonContentYMargin: RADIO_BUTTON_OPTIONS.yMargin

      }, options );

      //----------------------------------------------------------------------------------------
      // Add the radio buttons for each graph orientation
      const radioButtonContent = [];

      [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ].forEach( graphOrientation => {

        radioButtonContent.push( {
          value: graphOrientation,
          node: VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
        } );

      } );

      super( graphOrientationProperty, radioButtonContent, options );
    }
  }

  return vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );
} );