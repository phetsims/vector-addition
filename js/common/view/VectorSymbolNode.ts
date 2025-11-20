// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorSymbolNode is responsible for displaying vector symbols in a variety of forms.
 *
 * The symbol includes zero or more of the following, all of which can be mutated:
 *  - vector symbol, e.g. 'a'
 *  - arrow over the vector symbol
 *  - absolute value bars, to indicate magnitude, e.g. |a|
 *  - coefficient
 *
 * For instance, the vector 'a' could have a symbol of '|-3a|'. This can be achieved with this combination of
 * options:
 *
 * {
 *   symbolProperty: VectorAdditionSymbols.aStringProperty,
 *   coefficient: -3,
 *   showVectorArrow: false,
 *   includeAbsoluteValueBars: true
 * }
 *
 * The coefficient is auto formatted. A coefficient of 1 is hidden, while a coefficient of -1 is displayed as
 * unary minus. E.g. if vector 'a' has the coefficient -1, the displayed symbol would be '-a'.
 *
 * @author Brandon Li
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Font from '../../../../scenery/js/util/Font.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';

type SelfOptions = {
  symbolProperty?: TReadOnlyProperty<string> | null; // optional symbol to display
  coefficient?: number | null; // optional coefficient to display
  showVectorArrow?: boolean; // flag to whether to show an arrow above the vector symbol
  includeAbsoluteValueBars?: boolean; // whether to surround with absolute value bars, to indicate 'magnitude'
  symbolFont?: Font; // font used for the vector symbol
  font?: Font; // font used for everything that is not a symbol
};

type VectorSymbolNodeOptions = SelfOptions & PickOptional<HBoxOptions, 'spacing' | 'maxWidth'>;

export default class VectorSymbolNode extends HBox {

  // See SelfOptions for documentation of these properties.
  private symbolProperty: TReadOnlyProperty<string> | null;
  private coefficient: number | null;
  private includeAbsoluteValueBars: boolean;

  // Updates this Node when a setter method is called.
  private readonly updateVectorSymbolNode: () => void;

  public constructor( providedOptions?: VectorSymbolNodeOptions ) {

    const options = optionize<VectorSymbolNodeOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      symbolProperty: null,
      coefficient: null,
      showVectorArrow: true,
      includeAbsoluteValueBars: false,
      symbolFont: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
      font: VectorAdditionConstants.EQUATION_FONT,

      // HBoxOptions
      align: 'origin', // so that text baselines are aligned
      spacing: 2 // {number} spacing of the text nodes / formula nodes

    }, providedOptions );

    super( options );

    this.symbolProperty = options.symbolProperty;
    this.coefficient = options.coefficient;
    this.includeAbsoluteValueBars = options.includeAbsoluteValueBars;

    // Create the pieces of the VectorSymbolNode. Values will be set later, and these
    // will be added as children as needed based on how the VectorSymbolNode is configured.
    const leftBar = new Text( '|', { font: options.font } );
    const rightBar = new Text( '|', { font: options.font } );
    const coefficientText = new Text( '', { font: options.font } );
    const symbolNode = options.showVectorArrow ?
                       new ArrowOverSymbolNode( new StringProperty( '' ), { font: options.symbolFont } ) :
                       new RichText( '', { font: options.symbolFont } );

    this.updateVectorSymbolNode = () => {

      // Set the coefficient and symbol text to match our properties
      if ( this.coefficient !== null ) {
        coefficientText.setString( this.coefficient );
      }
      if ( this.symbolProperty ) {
        if ( symbolNode instanceof ArrowOverSymbolNode ) {
          symbolNode.setSymbolProperty( this.symbolProperty );
        }
        else {
          symbolNode.stringProperty = this.symbolProperty;
        }
      }

      // Add the pieces that are relevant for the current configuration.
      const children = [];
      this.includeAbsoluteValueBars && children.push( leftBar );
      ( this.coefficient !== null ) && children.push( coefficientText );
      this.symbolProperty && children.push( symbolNode );
      this.includeAbsoluteValueBars && children.push( rightBar );
      this.setChildren( children );

      // Set the visibility to true only if we have a child to display
      this.visible = ( children.length !== 0 );
    };

    // Update the vector symbol node
    this.updateVectorSymbolNode();

    this.disposeEmitter.addListener( () => symbolNode.dispose() );
  }

  /**
   * Determines whether absolute value bars are displayed to indicate 'magnitude'.
   * TODO: CM: Unused, see https://github.com/phetsims/vector-addition/issues/376
   */
  public setIncludeAbsoluteValueBars( includeAbsoluteValueBars: boolean ): void {
    this.includeAbsoluteValueBars = includeAbsoluteValueBars;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the symbol.
   * @param symbolProperty - the symbol to display. Null means no symbol is displayed.
   */
  public setSymbolProperty( symbolProperty: TReadOnlyProperty<string> | null ): void {
    this.symbolProperty = symbolProperty;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the coefficient.
   */
  public setCoefficient( coefficient: number | null ): void {
    this.coefficient = coefficient;
    this.updateVectorSymbolNode();
  }

  /**
   * Performance method that sets all the attributes of the VectorSymbolNode and does 1 update.
   * @param symbolProperty - the symbol to display (See comment at the top of the file)
   * @param coefficient - the coefficient to display
   * @param includeAbsoluteValueBars - indicates if absolute value bars are there
   */
  public setVectorSymbolNode( symbolProperty: TReadOnlyProperty<string> | null, coefficient: number | null, includeAbsoluteValueBars: boolean ): void {
    this.symbolProperty = symbolProperty;
    this.coefficient = coefficient;
    this.includeAbsoluteValueBars = includeAbsoluteValueBars;
    this.updateVectorSymbolNode();
  }
}

vectorAddition.register( 'VectorSymbolNode', VectorSymbolNode );