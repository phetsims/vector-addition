// Copyright 2019, University of Colorado Boulder

/**
 * Control panel for various features related to the play area.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const sumString = require( 'string!VECTOR_ADDITION/sum' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const TEXT_OPTIONS = {
    font: VectorAdditionConstants.PANEL_FONT,
    maxWidth: 200, // determined empirically
    minWidth: 110
  };
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;

  /**
   * @constructor
   */
  class GridPanel extends Panel {

    /**
     * @param {Property.<boolean>} sumVisibleProperty is the sum visible on the graph
     * @param {Property.<boolean>} valuesVisibleProperty are the numerical values of the vector visible on the graph
     * @param {Property.<boolean>} angleVisibleProperty is the vector angle visible on the graph
     * @param {Property.<boolean>} gridVisibleProperty is the grid visible on the graph
     * @param {Object} [options]
     * @constructor
     */
    constructor( sumVisibleProperty,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 options ) {


      options = _.extend( {
        includesAngle: false
      }, PANEL_OPTIONS, options );


      const ICON_SPACING = 15;

      // create the arrow icon with the icon factory
      // TODO: make the length and the color constants
      const arrowIconNode = VectorAdditionIconFactory.createArrowIcon( 25, 'blue' );

      // 'Sum' checkbox
      const sumCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        spacing: ICON_SPACING,
        children: [
          new Text( sumString, TEXT_OPTIONS ),
          arrowIconNode
        ]
      } ), sumVisibleProperty );

      // 'Values' checkbox
      const valuesCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        children: [
          new Text( valuesString, TEXT_OPTIONS )
        ]
      } ), valuesVisibleProperty );

      // 'Angle' checkbox
      const angleCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        children: [
          new Text( 'angle', TEXT_OPTIONS )
        ]
      } ), angleVisibleProperty );

      // Grid checkbox
      // 'Angle' checkbox
      const gridCheckbox = new Checkbox( new LayoutBox( {
        orientation: 'horizontal',
        spacing: ICON_SPACING,
        children: [
          // create the grid icon
          VectorAdditionIconFactory.createGridIcon( 25, 'blue' )
        ]
      } ), gridVisibleProperty );

      // vertical layout
      const contentNode = new LayoutBox( {
        children: ( options.includesAngle ) ?
          [ sumCheckbox, valuesCheckbox, angleCheckbox, gridCheckbox ] :
          [ sumCheckbox, valuesCheckbox, gridCheckbox ],
        orientation: 'vertical',
        spacing: 10,
        align: 'left'
      } );

      super( contentNode, options );
    }
  }

  return vectorAddition.register( 'GridPanel', GridPanel );
} );
