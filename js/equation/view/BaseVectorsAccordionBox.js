// Copyright 2019, University of Colorado Boulder

/**
 * View for the accordion box that appears on the right side of the 'Equation' screen.
 *
 * Functionality:
 *  - allow users to change the components of the vectors on cartesian mode
 *  - allow users to change the angle and the magnitude of the vectors on polar mode
 *  - allow users to toggle the visibility of the base vector nodes (via checkbox)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const showBaseVectorsString = require( 'string!VECTOR_ADDITION/showBaseVectors' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  // constants
  const EXPAND_COLLAPSE_PANEL_OPTIONS = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL;
  const SCREEN_VIEW_BOUNDS = VectorAdditionConstants.SCREEN_VIEW_BOUNDS;
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const CHECKBOX_OPTIONS = _.extend( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
    spacing: 5
  } );
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;
  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;

  // width for all labels
  const LABEL_WIDTH = 29;
  const COMPONENT_RANGE = new Range( -10, 10 );
  const ANGLE_RANGE = new Range( -180, 180 );
  const MAGNITUDE_RANGE = new Range( -10, 10 );
  class BaseVectorsAccordionBox extends AccordionBox {
    /**
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {Object} [options]
     */
    constructor( baseVectorsVisibleProperty, coordinateSnapMode, vectorSet, options ) {

      options = _.extend( {}, EXPAND_COLLAPSE_PANEL_OPTIONS, {

        fixedWidth: 170,
        contentXMargin: EXPAND_COLLAPSE_PANEL_OPTIONS.buttonXMargin,

        // superclass options
        titleNode: new Text( baseVectorsString, { font: PANEL_FONT } ),
        right: SCREEN_VIEW_BOUNDS.maxX - SCREEN_VIEW_X_MARGIN,
        top: 270,
        titleAlignX: 'left',
        titleXMargin: EXPAND_COLLAPSE_PANEL_OPTIONS.buttonXMargin
      }, options );

      // Limit width of title is the maximum size of the title.
      options.titleNode.maxWidth = options.fixedWidth
                                   - EXPAND_COLLAPSE_PANEL_OPTIONS.expandCollapseButtonOptions.sideLength
                                   - options.contentXMargin
                                   - options.buttonXMargin
                                   - options.titleXMargin;

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

      //----------------------------------------------------------------------------------------
      // Create the number pickers

      const children = [];

      const displayTypes = new Enumeration( [ 'X', 'Y', 'ANGLE', 'MAGNITUDE' ] );

      const pickerContainerWidth = contentWidth - 2 * 10;
      const pickerContainerHeight = 30;
      const createNumberPickerAndLabel = ( numberPicker, baseVector, displayType ) => {

        const suffix = displayType === displayTypes.MAGNITUDE ? `|${baseVector.symbol}|` : baseVector.symbol;

        let sub;
        if ( displayType === displayTypes.X ) {
          sub = symbolXString;
        }
        else if ( displayType === displayTypes.Y ) {
          sub = symbolYString;
        }
        else if ( displayType === displayTypes.ANGLE ) {
          sub = MathSymbols.THETA;
        }

        const text = new RichText( sub ? `${suffix}<sub>${sub}</sub> = ` : `${suffix} = `, {
          font: new MathSymbolFont( { size: 17, weight: 700 } )

        } );
        text.maxWidth = LABEL_WIDTH;

        const label = new AlignBox( text, {
          alignBounds: new Bounds2( 0, 0, LABEL_WIDTH, text.height ),
          maxWidth: LABEL_WIDTH
        } );

        return new HBox( {
          spacing: 4,
          children: [ label, numberPicker ]
        } );
      };

      if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        vectorSet.vectors.forEach( vector => {
          const baseVector = vector.baseVector;

          const xComponentPicker = new NumberPicker( baseVector.xComponentProperty,
            new Property( COMPONENT_RANGE ),
            NUMBER_PICKER_OPTIONS );

          const yComponentPicker = new NumberPicker( baseVector.yComponentProperty,
            new Property( COMPONENT_RANGE ),
            NUMBER_PICKER_OPTIONS );

          const xSide = createNumberPickerAndLabel( xComponentPicker, baseVector, displayTypes.X );
          const ySide = createNumberPickerAndLabel( yComponentPicker, baseVector, displayTypes.Y );

          children.push( new AlignBox( new HBox( {
            spacing: pickerContainerWidth - xSide.width - ySide.width,
            children: [ xSide, ySide ]
          } ), {
            alignBounds: new Bounds2( 0, 0, pickerContainerWidth, pickerContainerHeight )
          } ) );

        } );

      }
      else {

        vectorSet.vectors.forEach( vector => {
          const baseVector = vector.baseVector;

          const anglePicker = new NumberPicker( baseVector.angleDegreesProperty,
           new Property( ANGLE_RANGE ),
            _.extend( {}, NUMBER_PICKER_OPTIONS, {
              upFunction: ( value ) => {
                return value + POLAR_ANGLE_INTERVAL;
              },
              downFunction: value => {
                return value - POLAR_ANGLE_INTERVAL;
              }
            } ) );

          const magnitudePicker = new NumberPicker( baseVector.magnitudeProperty,
            new Property( MAGNITUDE_RANGE ),
            NUMBER_PICKER_OPTIONS );

          const ySide = createNumberPickerAndLabel( anglePicker, baseVector, displayTypes.ANGLE );
          const xSide = createNumberPickerAndLabel( magnitudePicker, baseVector, displayTypes.MAGNITUDE );

          children.push( new AlignBox( new HBox( {
            spacing: pickerContainerWidth - xSide.width - ySide.width,
            children: [ xSide, ySide ]
          } ), {
            alignBounds: new Bounds2( 0, 0, pickerContainerWidth, pickerContainerHeight )
          } ) );

        } );
      }

      //----------------------------------------------------------------------------------------
      // Create the 'Show Base Vectors checkbox'

      // Create the text node
      const showBaseVectorsText = new Text( showBaseVectorsString, { font: PANEL_FONT } );

      showBaseVectorsText.maxWidth = contentWidth - CHECKBOX_OPTIONS.boxWidth - CHECKBOX_OPTIONS.spacing;

      const baseVectorsCheckbox = new Checkbox( showBaseVectorsText, baseVectorsVisibleProperty, CHECKBOX_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create the accordion box

      children.push( baseVectorsCheckbox );


      const content = new VBox( {
        align: 'center',
        spacing: 15,
        children: children
      } );

      super( new Node( { children: [ content, new HStrut( contentWidth, { pickable: false } ) ] } ), options );

    }
  }

  return vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );
} );